import { Link } from 'react-router-dom';
import { BookOpen, Users, Info, Phone } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">About Our Platform</h1>
        <p className="text-gray-600 dark:text-gray-400">Learn more about our community and mission</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <BookOpen className="w-12 h-12 mb-4 opacity-80" />
          <h2 className="text-xl font-semibold mb-2">Share Knowledge</h2>
          <p className="opacity-90">
            Our platform enables developers and enthusiasts to share their knowledge, 
            experiences, and insights with a global community.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <Users className="w-12 h-12 mb-4 opacity-80" />
          <h2 className="text-xl font-semibold mb-2">Build Community</h2>
          <p className="opacity-90">
            Connect with like-minded individuals, engage in meaningful discussions, 
            and grow together through collaboration.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We believe in the power of open communication and knowledge sharing. Our platform 
            provides a space where ideas can flourish, connections can be made, and learning 
            never stops.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Whether you're a seasoned developer looking to share your expertise or a beginner 
            eager to learn, our community welcomes everyone. We foster an environment of 
            respect, collaboration, and continuous improvement.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Join us in building a better future through technology and community.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Transparent</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Open and honest communication in all interactions
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Inclusive</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Welcoming diverse perspectives and backgrounds
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Supportive</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Always here to help and guide each other
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Join Our Community
        </Link>
      </div>
    </div>
  );
}
