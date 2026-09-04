import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  getRecommendations,
  getApiError,
  selectStartup,
  getStartupById,
} from '../../services/api';

import Loading from '../../components/Loading';

import {
  Bot,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  XCircle,
  Mail,
} from 'lucide-react';


// =====================================================
// GET STARTUP EMAIL
// =====================================================

function getStartupEmail(startup, profile) {
  return (
    startup?.email ||
    profile?.email ||
    profile?.user?.email ||
    profile?.user_email ||
    null
  );
}


// =====================================================
// CHECK STARTUP ELIGIBILITY
// ONLY VERIFIED + ACTIVE STARTUPS CAN BE SELECTED
// =====================================================

function isStartupEligible(startup, profile) {
  if (!profile) {
    return false;
  }

  const verificationStatus =
    profile?.verification_status?.toUpperCase();

  const startupStatus =
    profile?.startup_status?.toUpperCase();

  return (
    verificationStatus === 'VERIFIED' &&
    startupStatus === 'ACTIVE'
  );
}


// =====================================================
// GET STATUS INFORMATION
// =====================================================

function getStartupStatus(profile) {
  if (!profile) {
    return {
      type: 'missing',
      label: 'Profile Not Found',
    };
  }

  const verificationStatus =
    profile?.verification_status?.toUpperCase();

  const startupStatus =
    profile?.startup_status?.toUpperCase();

  if (
    verificationStatus === 'VERIFIED' &&
    startupStatus === 'ACTIVE'
  ) {
    return {
      type: 'eligible',
      label: 'Verified & Active',
    };
  }

  if (verificationStatus === 'PENDING') {
    return {
      type: 'pending',
      label: 'Pending Verification',
    };
  }

  if (verificationStatus === 'REJECTED') {
    return {
      type: 'rejected',
      label: 'Rejected',
    };
  }

  if (startupStatus === 'INACTIVE') {
    return {
      type: 'inactive',
      label: 'Inactive',
    };
  }

  return {
    type: 'ineligible',
    label: 'Not Eligible',
  };
}


// =====================================================
// STATUS STYLING
// =====================================================

function getStatusClasses(type) {
  switch (type) {
    case 'eligible':
      return 'bg-green-50 text-green-700 border border-green-200';

    case 'pending':
      return 'bg-amber-50 text-amber-700 border border-amber-200';

    case 'rejected':
      return 'bg-red-50 text-red-700 border border-red-200';

    case 'inactive':
      return 'bg-slate-100 text-slate-600 border border-slate-200';

    case 'missing':
      return 'bg-amber-50 text-amber-700 border border-amber-200';

    default:
      return 'bg-orange-50 text-orange-700 border border-orange-200';
  }
}


export default function Recommendations() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [selecting, setSelecting] = useState(null);

  const [selectedStartup, setSelectedStartup] = useState(null);

  const [message, setMessage] = useState('');

  const [selectionError, setSelectionError] = useState('');


  // =====================================================
  // LOAD AI RECOMMENDATIONS
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    async function loadRecommendations() {
      try {
        setLoading(true);
        setError('');

        const result = await getRecommendations(id);

        if (!cancelled) {
          setData(result);

          const recs = Array.isArray(result?.recommendations)
            ? result.recommendations
            : [];

          // Fetch Django startup profiles
          const profileEntries = await Promise.all(
            recs.map(async (rec) => {
              const dId = rec?.django_startup_id;

              if (dId) {
                try {
                  const p = await getStartupById(dId);

                  return [dId, p];
                } catch {
                  return null;
                }
              }

              return null;
            })
          );

          if (!cancelled) {
            const map = {};

            profileEntries.forEach((entry) => {
              if (entry) {
                map[entry[0]] = entry[1];
              }
            });

            setProfiles(map);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiError(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRecommendations();

    return () => {
      cancelled = true;
    };
  }, [id]);


  // =====================================================
  // SELECT STARTUP
  // =====================================================

  async function select(startup) {
    const djangoStartupId =
      startup?.django_startup_id;

    // ---------------------------------------------------
    // NO DJANGO PROFILE
    // ---------------------------------------------------

    if (!djangoStartupId) {
      setSelectionError(
        'This recommended startup does not have a matching Django startup profile.'
      );

      setMessage('');

      return;
    }


    // ---------------------------------------------------
    // GET PROFILE
    // ---------------------------------------------------

    const profile =
      profiles[djangoStartupId];


    // ---------------------------------------------------
    // CHECK VERIFIED + ACTIVE
    // ---------------------------------------------------

    if (!isStartupEligible(startup, profile)) {
      const status =
        getStartupStatus(profile);

      let reason =
        'This startup is not eligible for selection.';

      if (status.type === 'pending') {
        reason =
          'This startup is still pending verification. Only verified and active startups can be selected.';
      } else if (status.type === 'rejected') {
        reason =
          'This startup has been rejected and cannot be selected.';
      } else if (status.type === 'inactive') {
        reason =
          'This startup is inactive and cannot be selected.';
      } else if (status.type === 'missing') {
        reason =
          'The startup profile could not be found.';
      } else {
        reason =
          'Only verified and active startups can be selected.';
      }

      setSelectionError(reason);
      setMessage('');

      return;
    }


    // ---------------------------------------------------
    // PREVENT SELECTING SAME STARTUP
    // ---------------------------------------------------

    if (selectedStartup === djangoStartupId) {
      return;
    }


    // ---------------------------------------------------
    // START SELECTING
    // ---------------------------------------------------

    setSelecting(djangoStartupId);

    setMessage('');
    setSelectionError('');


    try {
      const result = await selectStartup(
        id,
        djangoStartupId
      );

      setSelectedStartup(
        djangoStartupId
      );

      setMessage(
        result?.message ||
          'Startup selection request created successfully.'
      );
    } catch (err) {
      setSelectionError(
        getApiError(err)
      );
    } finally {
      setSelecting(null);
    }
  }


  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <Loading
        message="Running AI matching..."
      />
    );
  }


  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {
    return (
      <div className="mx-auto max-w-2xl py-20 text-center">

        <AlertCircle
          className="mx-auto h-12 w-12 text-red-400"
        />

        <h2 className="mt-4 text-xl font-semibold text-ink-700">
          Unable to load recommendations
        </h2>

        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>

        <Link
          to="/government/search"
          className="btn-primary mt-6"
        >
          Create Another Challenge
        </Link>

      </div>
    );
  }


  // =====================================================
  // NO DATA
  // =====================================================

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl py-20 text-center">

        <AlertCircle
          className="mx-auto h-12 w-12 text-ink-300"
        />

        <h2 className="mt-4 text-xl font-semibold text-ink-700">
          No recommendation data
        </h2>

        <p className="mt-2 text-sm text-ink-400">
          The backend did not return recommendation data.
        </p>

        <Link
          to="/government/search"
          className="btn-primary mt-6"
        >
          Create Another Challenge
        </Link>

      </div>
    );
  }


  // =====================================================
  // RECOMMENDATIONS
  // =====================================================

  const recommendations =
    Array.isArray(data.recommendations)
      ? data.recommendations
      : [];


  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="space-y-6">


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div>

        <div className="flex flex-wrap items-center justify-between gap-3">

          <div>

            <div className="flex items-center gap-2">

              <Bot
                className="h-6 w-6 text-plum-600"
              />

              <h1 className="text-2xl font-bold text-ink-700">
                AI Recommended Startups
              </h1>

            </div>

            <p className="mt-1 text-sm text-ink-400">
              Challenge #{data.challenge_id}
              {' — '}
              {data.challenge_title}
            </p>

          </div>


          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              navigate('/government/search')
            }
          >
            New Challenge
          </button>

        </div>

      </div>


      {/* ================================================= */}
      {/* INFORMATION BANNER */}
      {/* ================================================= */}



      {/* ================================================= */}
      {/* SUCCESS MESSAGE */}
      {/* ================================================= */}

      {message && (
        <div className="flex items-start gap-3 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">

          <CheckCircle
            className="mt-0.5 h-4 w-4 shrink-0"
          />

          <span>
            {message}
          </span>

        </div>
      )}


      {/* ================================================= */}
      {/* SELECTION ERROR */}
      {/* ================================================= */}

      {selectionError && (
        <div className="flex items-start gap-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">

          <XCircle
            className="mt-0.5 h-4 w-4 shrink-0"
          />

          <span>
            {selectionError}
          </span>

        </div>
      )}


      {/* ================================================= */}
      {/* RECOMMENDATIONS */}
      {/* ================================================= */}

      <div className="space-y-4">

        {recommendations.map((startup, index) => {

          const djangoStartupId =
            startup?.django_startup_id;

          const profile =
            djangoStartupId
              ? profiles[djangoStartupId]
              : null;

          const email =
            getStartupEmail(
              startup,
              profile
            );

          // IMPORTANT:
          // Only VERIFIED + ACTIVE
          // startups are eligible.
          const isEligible =
            isStartupEligible(
              startup,
              profile
            );

          const status =
            getStartupStatus(profile);

          const isSelected =
            selectedStartup === djangoStartupId;

          const isSelecting =
            selecting === djangoStartupId;


          return (
            <div
              key={
                djangoStartupId ||
                startup?.startup_id ||
                `${startup?.startup_name}-${index}`
              }
              className="card p-5"
            >


              {/* ========================================= */}
              {/* STARTUP HEADER */}
              {/* ========================================= */}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <div className="flex items-center gap-3">

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-plum-600 text-sm font-bold text-white">
                      {index + 1}
                    </span>

                    <h2 className="text-lg font-semibold text-ink-700">
                      {startup?.startup_name ||
                        'Unnamed Startup'}
                    </h2>

                  </div>


                  {/* EMAIL */}

                  {email ? (
                    <a
                      href={`mailto:${email}`}
                      className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-400 transition-colors hover:text-plum-600"
                    >
                      <Mail
                        className="h-4 w-4 shrink-0 text-ink-400"
                      />

                      <span>
                        {email}
                      </span>
                    </a>
                  ) : (
                    <p className="mt-2 text-sm text-ink-400">
                      Email not available
                    </p>
                  )}

                </div>


                {/* ======================================= */}
                {/* MATCH SCORE */}
                {/* ======================================= */}



              </div>


              {/* ========================================= */}
              {/* STATUS */}
              {/* ========================================= */}

              <div className="mt-4">

                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                    status.type
                  )}`}
                >
                  {status.type === 'eligible' && (
                    <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                  )}

                  {status.type !== 'eligible' && (
                    <XCircle className="mr-1.5 h-3.5 w-3.5" />
                  )}

                  {status.label}
                </span>

              </div>


              {/* ========================================= */}
              {/* ACTIONS */}
              {/* ========================================= */}

              <div className="mt-4 flex flex-wrap gap-2">


                {/* ======================================= */}
                {/* VIEW PROFILE */}
                {/* ======================================= */}

                {djangoStartupId ? (

                  <Link
                    to={`/government/startup/${djangoStartupId}`}
                    className="btn-ghost"
                  >
                    View Profile

                    <ArrowRight
                      className="h-4 w-4"
                    />
                  </Link>

                ) : (

                  <button
                    type="button"
                    disabled
                    className="btn-ghost pointer-events-none opacity-50"
                  >
                    View Profile

                    <ArrowRight
                      className="h-4 w-4"
                    />
                  </button>

                )}


                {/* ======================================= */}
                {/* SELECT STARTUP */}
                {/* ======================================= */}

                <button
                  type="button"
                  onClick={() =>
                    select(startup)
                  }
                  disabled={
                    !djangoStartupId ||
                    !isEligible ||
                    selecting !== null ||
                    isSelected
                  }
                  className={
                    isSelected
                      ? 'btn-secondary'
                      : isEligible
                        ? 'btn-primary'
                        : 'btn-secondary cursor-not-allowed opacity-50'
                  }
                >

                  {isSelecting ? (

                    'Selecting...'

                  ) : isSelected ? (

                    <>
                      Selected

                      <CheckCircle
                        className="h-4 w-4"
                      />
                    </>

                  ) : (

                    <>
                      Select Startup

                      <CheckCircle
                        className="h-4 w-4"
                      />
                    </>

                  )}

                </button>

              </div>


              {/* ========================================= */}
              {/* NOT ELIGIBLE MESSAGE */}
              {/* ========================================= */}

              {!isEligible && (

                <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">

                  {status.type === 'missing' && (
                    <>
                      This startup was returned by the ML
                      service, but no matching Django startup
                      profile was found. It cannot be selected
                      through the government application system.
                    </>
                  )}

                  {status.type === 'pending' && (
                    <>
                      This startup is pending verification.
                      It must be verified before the government
                      can select it.
                    </>
                  )}

                  {status.type === 'rejected' && (
                    <>
                      This startup has not passed verification
                      and cannot be selected.
                    </>
                  )}

                  {status.type === 'inactive' && (
                    <>
                      This startup profile is inactive and
                      cannot be selected.
                    </>
                  )}

                  {status.type === 'ineligible' && (
                    <>
                      This startup is not eligible for selection.
                      Only verified and active startups can be
                      selected.
                    </>
                  )}

                </div>

              )}


              {/* ========================================= */}
              {/* ELIGIBLE MESSAGE */}
              {/* ========================================= */}

              {isEligible && !isSelected && (

                <div className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">

                  This startup is verified and active and is
                  eligible for government selection.

                </div>

              )}

            </div>
          );
        })}


        {/* ================================================= */}
        {/* NO RECOMMENDATIONS */}
        {/* ================================================= */}

        {recommendations.length === 0 && (

          <div className="card py-12 text-center">

            <Bot
              className="mx-auto h-10 w-10 text-ink-300"
            />

            <p className="mt-3 text-sm text-ink-400">
              No recommendations were returned by the
              ML service.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate('/government/search')
              }
              className="btn-primary mt-5"
            >
              Create Another Challenge
            </button>

          </div>

        )}

      </div>

    </div>
  );
}