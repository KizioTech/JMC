import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './layout/Layout';
import { Quiz } from './Quiz';

interface QuizData {
  title: string;
  description: string;
  questions: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }[];
}

const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const response = await fetch(`/quizzes/${quizId}-quiz.json`);
        if (response.ok) {
          const data = await response.json();
          setQuizData(data);
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
      }
      setLoading(false);
    };

    if (quizId) {
      loadQuiz();
    }
  }, [quizId]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div>Loading quiz...</div>
        </div>
      </Layout>
    );
  }

  if (!quizData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div>Quiz not found</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
            <Quiz quizData={quizData} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizPage;