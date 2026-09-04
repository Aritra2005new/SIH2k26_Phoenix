import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  createChallenge,
  getDepartments,
  getApiError,
} from '../../services/api';

import Button from '../../components/Button';

import {
  Bot,
  ArrowRight,
} from 'lucide-react';


export default function ProblemSearch() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    department: '',
    title: '',
    problem_statement: '',
    desired_outcome: '',
    eligibility_criteria: '',
    required_technologies: '',
    required_domains: '',
    budget: '',
    pilot_duration: '',
    status: 'PUBLISHED',
  });

  const [departments, setDepartments] = useState([]);

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const [loadingDepartments, setLoadingDepartments] =
    useState(true);


  // =====================================================
  // LOAD DEPARTMENTS
  // =====================================================

  useEffect(() => {

    async function loadDepartments() {

      try {

        setLoadingDepartments(true);
        setError('');

        const data = await getDepartments();

        /*
         * Depending on your Django pagination settings,
         * the response may either be:
         *
         * [
         *   {...},
         *   {...}
         * ]
         *
         * OR:
         *
         * {
         *   count: 2,
         *   results: [...]
         * }
         */

        if (Array.isArray(data)) {
          setDepartments(data);
        } else if (Array.isArray(data?.results)) {
          setDepartments(data.results);
        } else {
          setDepartments([]);
        }

      } catch (err) {

        setError(
          getApiError(err)
        );

      } finally {

        setLoadingDepartments(false);

      }
    }

    loadDepartments();

  }, []);


  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  function change(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  }


  // =====================================================
  // SUBMIT CHALLENGE
  // =====================================================

  async function submit(e) {

    e.preventDefault();

    setError('');

    setLoading(true);

    try {

      const payload = {

        ...form,

        department: Number(form.department),

        budget:
          form.budget === ''
            ? null
            : Number(form.budget),

        pilot_duration:
          form.pilot_duration === ''
            ? null
            : Number(form.pilot_duration),

      };


      const challenge =
        await createChallenge(payload);


      navigate(
        `/government/recommendations/${challenge.id}`
      );

    } catch (err) {

      setError(
        getApiError(err)
      );

    } finally {

      setLoading(false);

    }
  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="mx-auto max-w-3xl space-y-6">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div>

        <h1 className="text-2xl font-bold text-ink-700">
          Create Government Challenge
        </h1>

        <p className="mt-1 text-ink-400">
          Create the challenge first. The ML recommendation
          system will then find suitable startups.
        </p>

      </div>


      {/* ================================================= */}
      {/* FORM */}
      {/* ================================================= */}

      <form
        onSubmit={submit}
        className="card space-y-5 p-6"
      >

        {/* ERROR */}

        {error && (

          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">

            {error}

          </div>

        )}


        {/* ================================================= */}
        {/* DEPARTMENT + STATUS */}
        {/* ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2">

          {/* DEPARTMENT */}

          <div>

            <label className="mb-1.5 block text-sm font-medium text-ink-600">

              Government Department

            </label>


            <select
              name="department"
              value={form.department}
              onChange={change}
              required
              disabled={loadingDepartments}
              className="input-field"
            >

              <option value="">

                {loadingDepartments
                  ? 'Loading departments...'
                  : 'Select Department'}

              </option>


              {departments.map((department) => (

                <option
                  key={department.id}
                  value={department.id}
                >

                  {department.name}

                </option>

              ))}

            </select>


            <p className="mt-1 text-xs text-ink-400">

              Select the department responsible for
              this government challenge.

            </p>

          </div>


          {/* STATUS */}

          <div>

            <label className="mb-1.5 block text-sm font-medium text-ink-600">

              Status

            </label>


            <select
              name="status"
              value={form.status}
              onChange={change}
              className="input-field"
            >

              <option value="DRAFT">
                DRAFT
              </option>

              <option value="PUBLISHED">
                PUBLISHED
              </option>

              <option value="CLOSED">
                CLOSED
              </option>

            </select>

          </div>

        </div>


        {/* ================================================= */}
        {/* TITLE */}
        {/* ================================================= */}

        <div>

          <label className="mb-1.5 block text-sm font-medium text-ink-600">

            Challenge Title

          </label>


          <input
            name="title"
            value={form.title}
            onChange={change}
            required
            className="input-field"
            placeholder="Smart Waste Collection Optimization"
          />

        </div>


        {/* ================================================= */}
        {/* PROBLEM STATEMENT */}
        {/* ================================================= */}

        <div>

          <label className="mb-1.5 block text-sm font-medium text-ink-600">

            Problem Statement

          </label>


          <textarea
            name="problem_statement"
            value={form.problem_statement}
            onChange={change}
            required
            rows={5}
            className="input-field resize-none"
            placeholder="Describe the government problem..."
          />

        </div>


        {/* ================================================= */}
        {/* DESIRED OUTCOME */}
        {/* ================================================= */}

        <div>

          <label className="mb-1.5 block text-sm font-medium text-ink-600">

            Desired Outcome

          </label>


          <textarea
            name="desired_outcome"
            value={form.desired_outcome}
            onChange={change}
            required
            rows={3}
            className="input-field resize-none"
            placeholder="Describe the expected outcome..."
          />

        </div>


        {/* ================================================= */}
        {/* ELIGIBILITY */}
        {/* ================================================= */}

        <div>

          <label className="mb-1.5 block text-sm font-medium text-ink-600">

            Eligibility Criteria

          </label>


          <textarea
            name="eligibility_criteria"
            value={form.eligibility_criteria}
            onChange={change}
            rows={2}
            className="input-field resize-none"
            placeholder="Who should be eligible to participate?"
          />

        </div>


        {/* ================================================= */}
        {/* TECHNOLOGIES + DOMAINS */}
        {/* ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2">

          <div>

            <label className="mb-1.5 block text-sm font-medium text-ink-600">

              Required Technologies

            </label>


            <input
              name="required_technologies"
              value={form.required_technologies}
              onChange={change}
              className="input-field"
              placeholder="AI, IoT, Python"
            />

          </div>


          <div>

            <label className="mb-1.5 block text-sm font-medium text-ink-600">

              Required Domains

            </label>


            <input
              name="required_domains"
              value={form.required_domains}
              onChange={change}
              className="input-field"
              placeholder="Waste Management, Smart City"
            />

          </div>

        </div>


        {/* ================================================= */}
        {/* BUDGET + PILOT DURATION */}
        {/* ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2">

          <div>

            <label className="mb-1.5 block text-sm font-medium text-ink-600">

              Budget

            </label>


            <input
              name="budget"
              type="number"
              step="0.01"
              min="0"
              value={form.budget}
              onChange={change}
              className="input-field"
              placeholder="500000"
            />

          </div>


          <div>

            <label className="mb-1.5 block text-sm font-medium text-ink-600">

              Pilot Duration (months)

            </label>


            <input
              name="pilot_duration"
              type="number"
              min="0"
              value={form.pilot_duration}
              onChange={change}
              className="input-field"
              placeholder="6"
            />

          </div>

        </div>


        {/* ================================================= */}
        {/* SUBMIT */}
        {/* ================================================= */}

        <Button
          type="submit"
          disabled={
            loading ||
            loadingDepartments ||
            departments.length === 0
          }
        >

          {loading
            ? 'Creating...'
            : 'Create Challenge & Get AI Recommendations'}

          {/* <Bot className="h-4 w-4" />

          <ArrowRight className="h-4 w-4" /> */}

        </Button>

      </form>

    </div>

  );
}