import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Users,
  MessageSquare,
  Bell,
  FileUp,
  Layers,
  ArrowRight,
  Check,
  Globe,
  Shield,
  Clock,
  Menu,
  X,
  Moon,
  Sun,
  ChevronDown,
  Sparkles,
  Layers3,
  LayoutGrid,
  UserPlus,
  LogIn,
} from 'lucide-react';

interface Feature {
  icon: typeof Zap;
  title: string;
  description: string;
  color: string;
}

interface TechStack {
  name: string;
  color: string;
}

interface FAQ {
  q: string;
  a: string;
}

const features: Feature[] = [
  {
    icon: Layers3,
    title: 'Kanban Boards',
    description:
      'Visualize workflows with intuitive drag-and-drop boards. Real-time sync keeps everyone aligned.',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    icon: MessageSquare,
    title: 'Team Chat',
    description:
      'Instant messaging with typing indicators and online presence. Never miss a beat.',
    color: 'from-fuchsia-400 to-pink-500',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description:
      'Stay updated on task assignments, mentions, and workspace activity.',
    color: 'from-amber-400 to-orange-500',
  },
  {
    icon: FileUp,
    title: 'File Sharing',
    description:
      'Upload attachments and profile images seamlessly with Cloudinary integration.',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    icon: UserPlus,
    title: 'Workspace Invites',
    description:
      'Generate invite codes, manage roles, and build teams effortlessly.',
    color: 'from-violet-400 to-purple-500',
  },
  {
    icon: LayoutGrid,
    title: 'Task Filtering',
    description:
      'Search and filter by status, assignee, or keywords. Find what you need instantly.',
    color: 'from-rose-400 to-red-500',
  },
];

const techStack: TechStack[] = [
  { name: 'React', color: 'from-cyan-400 to-blue-500' },
  { name: 'Node.js', color: 'from-green-400 to-emerald-500' },
  { name: 'MongoDB', color: 'from-yellow-400 to-amber-500' },
  { name: 'Socket.io', color: 'from-pink-400 to-rose-500' },
];

const faqs: FAQ[] = [
  {
    q: 'How does real-time collaboration work?',
    a: 'CollabSync uses WebSocket connections via Socket.io to instantly sync changes across all connected clients. When one user updates a task, everyone sees it instantly.',
  },
  {
    q: 'Can I manage multiple workspaces?',
    a: 'Yes! Create and manage multiple workspaces, invite different team members, and switch between them seamlessly.',
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. We use JWT authentication, bcrypt password hashing, and Helmet for security headers. All data is encrypted in transit and at rest.',
  },
  {
    q: 'How do I invite team members?',
    a: 'Generate a unique invite code from your workspace settings. Anyone with the code can join your workspace instantly.',
  },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-dark-900 text-white' : 'bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 text-slate-900'}`}
    >
      <div className="grain-overlay" />

      {/* Ambient Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 -left-40 w-96 h-96 rounded-full ${darkMode ? 'bg-purple-600/20' : 'bg-purple-300/40'} blur-3xl gradient-blob`}
        />
        <div
          className={`absolute top-60 -right-40 w-80 h-80 rounded-full ${darkMode ? 'bg-cyan-500/20' : 'bg-cyan-300/30'} blur-3xl gradient-blob`}
        />
        <div
          className={`absolute bottom-20 left-1/3 w-72 h-72 rounded-full ${darkMode ? 'bg-fuchsia-500/15' : 'bg-pink-300/30'} blur-3xl gradient-blob`}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50">
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span
                className={`text-2xl font-bold font-display ${darkMode ? 'text-white' : 'text-slate-900'}`}
              >
                Collab<span className="text-gradient">Sync</span>
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className={`text-sm font-medium transition-colors ${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Features
              </a>
              <a
                href="#tech"
                className={`text-sm font-medium transition-colors ${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Tech Stack
              </a>
              <a
                href="#faq"
                className={`text-sm font-medium transition-colors ${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                FAQ
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-xl transition-all ${darkMode ? 'bg-dark-700 hover:bg-dark-600 text-yellow-400' : 'bg-white hover:bg-slate-100 text-slate-600'}`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => navigate('/register')}
                className={`hidden sm:flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                  darkMode
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
                    : 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-300/50'
                }`}
              >
                <LogIn size={18} />
                <span>Get Started</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                {mobileMenuOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden absolute top-full left-0 right-0 ${darkMode ? 'bg-dark-800 border-t border-dark-600' : 'bg-white border-t border-slate-200'} shadow-xl`}
          >
            <div className="px-4 py-6 space-y-4">
              <a
                href="#features"
                className="block text-base font-medium"
              >
                Features
              </a>
              <a href="#tech" className="block text-base font-medium">
                Tech Stack
              </a>
              <a href="#faq" className="block text-base font-medium">
                FAQ
              </a>
              <button
                onClick={() => navigate('/register')}
                className="w-full flex items-center justify-center space-x-2 px-5 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
              >
                <LogIn size={18} />
                <span>Get Started</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-up">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">
                  Built for modern teams
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
                <span
                  className={
                    darkMode ? 'text-white' : 'text-slate-900'
                  }
                >
                  Collab
                </span>
                <span className="text-gradient">orate</span>
                <br />
                <span
                  className={
                    darkMode ? 'text-white' : 'text-slate-900'
                  }
                >
                  in{' '}
                </span>
                <span className="text-gradient">Realtime</span>
              </h1>

              <p
                className={`text-xl max-w-lg leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
              >
                A powerful workspace platform with Kanban boards, team
                chat, and instant sync. Built with MERN stack and
                Socket.io for seamless collaboration.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-cyan-600 text-white font-semibold text-lg shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-105">
                  <span>Start Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  className={`flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl font-semibold text-lg transition-all border-2 ${
                    darkMode
                      ? 'border-dark-500 hover:border-purple-500 text-slate-300 hover:text-white'
                      : 'border-slate-300 hover:border-purple-500 text-slate-700 hover:text-purple-600'
                  }`}
                >
                  <span>Watch Demo</span>
                </button>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex -space-x-3">
                  {[
                    'bg-purple-400',
                    'bg-cyan-400',
                    'bg-fuchsia-400',
                    'bg-amber-400',
                  ].map((color, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-full ${color} border-2 ${darkMode ? 'border-dark-800' : 'border-white'}`}
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">2,500+</span>
                  <span
                    className={
                      darkMode ? 'text-slate-500' : 'text-slate-500'
                    }
                  >
                    {' '}
                    teams collaborating
                  </span>
                </div>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative animate-slide-up stagger-2">
              <div
                className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-3xl blur-2xl opacity-20`}
              />
              <div
                className={`relative rounded-3xl overflow-hidden ${darkMode ? 'bg-dark-800/80 border border-dark-600' : 'bg-white border border-slate-200'} shadow-2xl backdrop-blur-xl`}
              >
                {/* Browser Chrome */}
                <div className="flex items-center space-x-2 px-4 py-3 bg-dark-700/50 border-b border-dark-600">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="flex-1 mx-4 h-6 rounded-lg bg-dark-600/50" />
                </div>

                {/* Dashboard Content */}
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500" />
                      <span className="font-semibold">
                        Team Workspace
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-purple-400" />
                      <div className="w-6 h-6 rounded-full bg-cyan-400 -ml-2" />
                      <div className="w-6 h-6 rounded-full bg-fuchsia-400 -ml-2" />
                    </div>
                  </div>

                  {/* Kanban Preview */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        title: 'To Do',
                        tasks: ['Design login', 'API setup'],
                        color: 'bg-slate-500',
                      },
                      {
                        title: 'In Progress',
                        tasks: ['Build dashboard', 'Auth flow'],
                        color: 'bg-amber-500',
                      },
                      {
                        title: 'Done',
                        tasks: ['DB schema', 'Socket setup'],
                        color: 'bg-emerald-500',
                      },
                    ].map((column, i) => (
                      <div
                        key={i}
                        className={`rounded-xl p-3 ${darkMode ? 'bg-dark-700' : 'bg-slate-100'}`}
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <div
                            className={`w-2 h-2 rounded-full ${column.color}`}
                          />
                          <span className="text-xs font-medium">
                            {column.title}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {column.tasks.map((task, j) => (
                            <div
                              key={j}
                              className={`p-2 rounded-lg ${darkMode ? 'bg-dark-600' : 'bg-white'} shadow-sm`}
                            >
                              <div className="w-full h-2 rounded bg-slate-300 mb-1" />
                              <div className="w-2/3 h-1.5 rounded bg-slate-200" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Preview */}
                  <div
                    className={`rounded-xl p-4 ${darkMode ? 'bg-dark-700' : 'bg-slate-100'}`}
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <MessageSquare className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-medium">
                        Team Chat
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <div className="w-5 h-5 rounded-full bg-purple-400" />
                        <div
                          className={`p-2 rounded-lg ${darkMode ? 'bg-dark-600' : 'bg-white'}`}
                        >
                          <div className="w-16 h-2 rounded bg-slate-300 mb-1" />
                          <div className="w-12 h-1.5 rounded bg-slate-200" />
                        </div>
                      </div>
                      <div className="flex items-start space-x-2 ml-4">
                        <div className="w-5 h-5 rounded-full bg-cyan-400" />
                        <div
                          className={`p-2 rounded-lg ${darkMode ? 'bg-dark-600' : 'bg-white'}`}
                        >
                          <div className="w-20 h-2 rounded bg-slate-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2
              className={`text-4xl md:text-5xl font-display font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}
            >
              Everything you need
            </h2>
            <p
              className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
            >
              Powerful features designed for modern teams. Real-time
              sync, intuitive UI, and seamless collaboration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`group p-6 rounded-2xl transition-all duration-500 animate-slide-up hover:scale-105 ${
                  darkMode
                    ? 'bg-dark-800/50 border border-dark-600 hover:border-purple-500/50 hover:bg-dark-700/50'
                    : 'bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-200/50'
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3
                  className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}
                >
                  {feature.title}
                </h3>
                <p
                  className={
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="relative z-10 py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${darkMode ? 'bg-dark-800 border border-dark-600' : 'bg-white border border-slate-200'} mb-8`}
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-sm">
              Built with modern technology
            </span>
          </div>

          <h2
            className={`text-4xl md:text-5xl font-display font-bold mb-8 ${darkMode ? 'text-white' : 'text-slate-900'}`}
          >
            MERN Stack Power
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, i) => (
              <div
                key={i}
                className={`px-8 py-4 rounded-2xl bg-gradient-to-r ${tech.color} text-white font-semibold text-lg shadow-lg hover:scale-105 transition-transform`}
              >
                {tech.name}
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mt-16">
            {[
              {
                icon: Clock,
                title: 'Real-time Sync',
                desc: 'Socket.io powers instant updates across all clients',
              },
              {
                icon: Shield,
                title: 'JWT Security',
                desc: 'Secure authentication with bcrypt password hashing',
              },
              {
                icon: Users,
                title: 'Team workspaces',
                desc: 'Invite members, assign roles, collaborate together',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl ${darkMode ? 'bg-dark-800/50 border border-dark-600' : 'bg-white border border-slate-200'}`}
              >
                <item.icon className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                <h3
                  className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h2
            className={`text-4xl font-display font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-slate-900'}`}
          >
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-dark-800/50 border border-dark-600' : 'bg-white border border-slate-200'}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span
                    className={`font-semibold pr-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-purple-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p
                      className={
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }
                    >
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-purple-600 via-fuchsia-600 to-cyan-600">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
              }}
            />
            <div className="relative px-8 py-16 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Ready to transform your workflow?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Join thousands of teams already collaborating in
                real-time with CollabSync.
              </p>
              <button className="px-8 py-4 rounded-2xl bg-white text-purple-600 font-semibold text-lg hover:scale-105 transition-transform shadow-xl">
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`relative z-10 py-12 px-4 border-t ${darkMode ? 'border-dark-700' : 'border-slate-200'}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span
                className={`text-xl font-bold font-display ${darkMode ? 'text-white' : 'text-slate-900'}`}
              >
                Collab<span className="text-gradient">Sync</span>
              </span>
            </div>
            <p
              className={
                darkMode
                  ? 'text-slate-500 text-sm'
                  : 'text-slate-500 text-sm'
              }
            >
              © 2026 CollabSync. Built with MERN + Socket.io.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
