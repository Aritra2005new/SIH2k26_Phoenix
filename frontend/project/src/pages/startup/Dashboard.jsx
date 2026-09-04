import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  ClipboardList,
  Bell,
  ArrowRight,
} from 'lucide-react';

export default function StartupDashboard() {
  const { user } = useAuth();

  const profile = JSON.parse(
    localStorage.getItem('startup_profile') || 'null'
  );

  const storageKey = `accepted_applications_${user?.id}`;

  const projects = JSON.parse(
    localStorage.getItem(storageKey) || '[]'
  );

  return (
    <div className="relative space-y-6">
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-3xl" />

      <div>
        <h1 className="text-3xl font-black tracking-tight text-ink-700">
          Welcome, {user?.username || 'Startup'}
        </h1>

        <p className="mt-1 text-ink-400">
          Manage your backend-backed startup profile and government requests.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          to="/startup/profile"
          className="card p-5 hover:shadow-card-hover"
        >
          <Briefcase className="h-5 w-5 text-plum-600" />

          <p className="mt-3 font-semibold text-ink-700">
            My Profile
          </p>

          <p className="mt-1 text-sm text-ink-400">
            {profile
              ? 'Profile saved locally'
              : 'Create your startup profile'}
          </p>
        </Link>

        <Link
          to="/startup/requests"
          className="card p-5 hover:shadow-card-hover"
        >
          <ClipboardList className="h-5 w-5 text-plum-600" />

          <p className="mt-3 font-semibold text-ink-700">
            Challenge Requests
          </p>

          <p className="mt-1 text-sm text-ink-400">
            View pending selections
          </p>
        </Link>

        <Link
          to="/startup/notifications"
          className="card p-5 hover:shadow-card-hover"
        >
          <Bell className="h-5 w-5 text-plum-600" />

          <p className="mt-3 font-semibold text-ink-700">
            Notifications
          </p>

          <p className="mt-1 text-sm text-ink-400">
            See application updates
          </p>
        </Link>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink-700">
              Accepted Projects
            </h2>

            <p className="mt-1 text-sm text-ink-400">
              Projects accepted by your startup.
            </p>
          </div>

          <Link
            to="/startup/projects"
            className="text-sm font-semibold text-plum-600"
          >
            Open{' '}
            <ArrowRight className="inline h-4 w-4" />
          </Link>
        </div>

        <p className="mt-4 text-3xl font-bold text-ink-700">
          {projects.length}
        </p>
      </div>
    </div>
  );
}