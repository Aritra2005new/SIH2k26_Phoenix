import { useEffect, useState } from 'react';
import {
  Save,
  Loader2,
  AlertCircle,
  Upload,
  Image,
  FileText,
  X,
} from 'lucide-react';

import {
  createStartupProfile,
  getMyStartupProfile,
  updateMyStartupProfile,
  getApiError,
} from '../../services/api';

const EMPTY_FORM = {
  name: '',
  description: '',
  domains: '',
  technologies: '',
  solutions: '',
  keywords: '',
  target_customers: '',
  past_experience: '',
  team_size: '',
  founded_year: '',
  location: '',
  average_budget: '',
  eligibility_status: '',
};

export default function Profile() {
  const [form, setForm] = useState(EMPTY_FORM);

  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // =========================================================
  // FUTURE SCOPE / DEMO ONLY
  // =========================================================

  // Startup logo
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  // Verified documents
  const [verifiedDocuments, setVerifiedDocuments] = useState([]);

  // =========================================================
  // LOAD STARTUP PROFILE
  // =========================================================

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setError('');

    try {
      const data = await getMyStartupProfile();

      setForm({
        name: data.name ?? '',
        description: data.description ?? '',
        domains: data.domains ?? '',
        technologies: data.technologies ?? '',
        solutions: data.solutions ?? '',
        keywords: data.keywords ?? '',
        target_customers: data.target_customers ?? '',
        past_experience: data.past_experience ?? '',
        team_size: data.team_size ?? '',
        founded_year: data.founded_year ?? '',
        location: data.location ?? '',
        average_budget: data.average_budget ?? '',
        eligibility_status: data.eligibility_status ?? '',
      });

      setProfileExists(true);
    } catch (err) {
      /*
       * A 404 means the authenticated startup
       * does not have a profile yet.
       *
       * This is NOT treated as an error.
       */
      if (err?.response?.status === 404) {
        setProfileExists(false);
        setForm(EMPTY_FORM);
      } else {
        setError(getApiError(err));
      }
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // HANDLE TEXT INPUT
  // =========================================================

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess('');
    setError('');
  }

  // =========================================================
  // HANDLE LOGO UPLOAD
  // FUTURE SCOPE / DEMO ONLY
  // =========================================================

  function handleLogoChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    // Only allow image files
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file for the startup logo.');
      return;
    }

    setError('');
    setSuccess('');

    setLogoFile(file);

    // Create temporary local preview
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  }

  // =========================================================
  // REMOVE LOGO
  // FUTURE SCOPE / DEMO ONLY
  // =========================================================

  function removeLogo() {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoFile(null);
    setLogoPreview('');

    // Reset input
    const input = document.getElementById('startup-logo');

    if (input) {
      input.value = '';
    }
  }

  // =========================================================
  // HANDLE VERIFIED DOCUMENTS
  // FUTURE SCOPE / DEMO ONLY
  // =========================================================

  function handleDocumentsChange(e) {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    setError('');
    setSuccess('');

    // Add newly selected documents
    setVerifiedDocuments((previous) => [
      ...previous,
      ...files,
    ]);

    // Allow selecting the same file again later
    e.target.value = '';
  }

  // =========================================================
  // REMOVE VERIFIED DOCUMENT
  // FUTURE SCOPE / DEMO ONLY
  // =========================================================

  function removeDocument(indexToRemove) {
    setVerifiedDocuments((previous) =>
      previous.filter((_, index) => index !== indexToRemove)
    );
  }

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');
    setSuccess('');
    setSaving(true);

    try {
      /*
       * IMPORTANT:
       *
       * logoFile and verifiedDocuments are intentionally
       * NOT included here.
       *
       * They are demo/future-scope UI features only.
       *
       * The existing backend continues receiving only
       * the original profile form data.
       */

      if (profileExists) {
        // Existing profile
        // PATCH /api/startups/my-profile/
        await updateMyStartupProfile(form);

        setSuccess(
          'Startup profile updated successfully.'
        );
      } else {
        // New profile
        // POST /api/startups/profile/
        await createStartupProfile(form);

        setProfileExists(true);

        setSuccess(
          'Startup profile created successfully.'
        );
      }

      // Reload data from backend
      await loadProfile();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-ink-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="mx-auto max-w-4xl">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6">
        <div className="flex items-center gap-3">

          {/* Startup Logo / Placeholder */}
          <div className="relative">

            {logoPreview ? (
              <div className="relative">
                <img
                  src={logoPreview}
                  alt="Startup logo preview"
                  className="h-11 w-11 rounded-lg object-cover border border-ink-100"
                />

                {/* Remove logo */}
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600"
                  aria-label="Remove logo"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="startup-logo"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-ink-200 bg-ink-50 transition hover:border-plum-400 hover:bg-plum-50"
                title="Add startup logo"
              >
                <Image className="h-5 w-5 text-ink-400" />
              </label>
            )}

            {/* Hidden file input */}
            <input
              id="startup-logo"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-ink-700">
              Startup Profile
            </h1>

            <p className="text-sm text-ink-400">
              Keep your startup information up to date
              for government matching.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

          <span>{error}</span>
        </div>
      )}

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {success && (
        <div className="mb-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* =====================================================
          FORM
      ===================================================== */}

      <div className="card p-6">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <div>
            <h2 className="mb-4 text-lg font-semibold text-ink-700">
              Basic Information
            </h2>

            <div className="grid gap-4 md:grid-cols-2">

              {/* Startup Name */}

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-ink-600">
                  Startup Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter startup name"
                />
              </div>

              {/* Description */}

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-ink-600">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="input-field"
                  placeholder="Describe your startup"
                />
              </div>

              {/* Location */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-600">
                  Location
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Bhubaneswar"
                />
              </div>

              {/* Founded Year */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-600">
                  Founded Year
                </label>

                <input
                  type="number"
                  name="founded_year"
                  value={form.founded_year}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="2024"
                />
              </div>

              {/* Team Size */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-600">
                  Team Size
                </label>

                <input
                  type="number"
                  name="team_size"
                  value={form.team_size}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="10"
                />
              </div>

              {/* Average Budget */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-600">
                  Average Budget
                </label>

                <input
                  name="average_budget"
                  value={form.average_budget}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="500000"
                />
              </div>

            </div>
          </div>

          {/* =================================================
              STARTUP LOGO
              FUTURE SCOPE
          ================================================= */}

          <div>
            <h2 className="mb-4 text-lg font-semibold text-ink-700">
              Startup Branding
            </h2>

            <div className="rounded-xl border border-dashed border-ink-200 bg-ink-50/50 p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                {/* Logo Preview */}

                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink-200 bg-white">

                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Startup logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image className="h-8 w-8 text-ink-300" />
                  )}

                </div>

                {/* Upload Area */}

                <div>
                  <h3 className="text-sm font-semibold text-ink-700">
                    Startup Logo
                  </h3>

                  <p className="mt-1 text-xs text-ink-400">
                    Upload a logo for your startup profile.
                  </p>

                  <label
                    htmlFor="startup-logo-main"
                    className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
                  >
                    <Upload className="h-4 w-4" />

                    {logoFile
                      ? 'Change Logo'
                      : 'Choose Logo'}
                  </label>

                  <input
                    id="startup-logo-main"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />

                  <p className="mt-2 text-xs text-ink-400">
                    Demo only · Logo upload will be connected
                    to the backend in future scope.
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* =================================================
              CAPABILITIES
          ================================================= */}

          <div>
            <h2 className="mb-4 text-lg font-semibold text-ink-700">
              Capabilities
            </h2>

            <div className="space-y-4">

              {/* Domains */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-600">
                  Domains
                </label>

                <textarea
                  name="domains"
                  value={form.domains}
                  onChange={handleChange}
                  rows={2}
                  className="input-field"
                  placeholder="AI, Healthcare, Agriculture"
                />
              </div>

              {/* Technologies */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-600">
                  Technologies
                </label>

                <textarea
                  name="technologies"
                  value={form.technologies}
                  onChange={handleChange}
                  rows={2}
                  className="input-field"
                  placeholder="Python, Django, React, Machine Learning"
                />
              </div>

              {/* Solutions */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-600">
                  Solutions
                </label>

                <textarea
                  name="solutions"
                  value={form.solutions}
                  onChange={handleChange}
                  rows={3}
                  className="input-field"
                  placeholder="Describe the solutions your startup provides"
                />
              </div>

              {/* Keywords */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-600">
                  Keywords
                </label>

                <textarea
                  name="keywords"
                  value={form.keywords}
                  onChange={handleChange}
                  rows={2}
                  className="input-field"
                  placeholder="AI, IoT, smart city, automation"
                />
              </div>

            </div>
          </div>

          {/* =================================================
              EXPERIENCE
          ================================================= */}

          <div>
            <h2 className="mb-4 text-lg font-semibold text-ink-700">
              Experience & Eligibility
            </h2>

            <div className="space-y-4">

              {/* Target Customers */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-600">
                  Target Customers
                </label>

                <textarea
                  name="target_customers"
                  value={form.target_customers}
                  onChange={handleChange}
                  rows={2}
                  className="input-field"
                  placeholder="Government departments, hospitals, schools..."
                />
              </div>

              {/* Past Experience */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-600">
                  Past Experience
                </label>

                <textarea
                  name="past_experience"
                  value={form.past_experience}
                  onChange={handleChange}
                  rows={3}
                  className="input-field"
                  placeholder="Previous projects and experience"
                />
              </div>

              {/* Eligibility */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-600">
                  Eligibility Status
                </label>

                <input
                  name="eligibility_status"
                  value={form.eligibility_status}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Eligible"
                />
              </div>

            </div>
          </div>

          {/* =================================================
              VERIFIED DOCUMENTS
              FUTURE SCOPE
          ================================================= */}

          <div>
            <h2 className="mb-4 text-lg font-semibold text-ink-700">
              Verified Documents
            </h2>

            <div className="rounded-xl border border-dashed border-ink-200 bg-ink-50/50 p-5">

              {/* Upload */}

              <label
  htmlFor="verified-documents"
  className="flex cursor-pointer items-center gap-4 rounded-lg border border-ink-200 bg-white px-4 py-4 transition hover:border-plum-400 hover:bg-plum-50/40"
>
  {/* Icon */}
  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-plum-50">
    <FileText className="h-5 w-5 text-plum-600" />
  </div>

  {/* Text */}
  <div className="flex-1">
    <p className="text-sm font-semibold text-ink-700">
      Upload verified documents
    </p>

    <p className="mt-0.5 text-xs text-ink-400">
      Select multiple documents at once
    </p>
  </div>

  {/* Button */}
  <span className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2 text-xs font-medium text-ink-600">
    <Upload className="h-3.5 w-3.5" />
    Choose Files
  </span>
</label>

              <input
                id="verified-documents"
                type="file"
                multiple
                onChange={handleDocumentsChange}
                className="hidden"
              />

              {/* Selected Documents */}

              {verifiedDocuments.length > 0 && (
                <div className="mt-4 space-y-2">

                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                    Selected Documents
                  </p>

                  {verifiedDocuments.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-ink-100 bg-white px-4 py-3"
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-plum-50">
                          <FileText className="h-4 w-4 text-plum-600" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink-700">
                            {file.name}
                          </p>

                          <p className="text-xs text-ink-400">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="shrink-0 rounded-lg p-2 text-ink-400 transition hover:bg-red-50 hover:text-red-500"
                        aria-label={`Remove ${file.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>

                    </div>
                  ))}

                </div>
              )}

              <p className="mt-3 text-xs text-ink-400">
                Demo only · Document verification and backend
                storage will be implemented in future scope.
              </p>

            </div>
          </div>

          {/* =================================================
              SAVE
          ================================================= */}

          <div className="flex justify-end border-t border-ink-100 pt-5">

            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >

              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />

                  {profileExists
                    ? 'Update Profile'
                    : 'Create Profile'}
                </>
              )}

            </button>

          </div>

        </form>
      </div>
    </div>
  );
}