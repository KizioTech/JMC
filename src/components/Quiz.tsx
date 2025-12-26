import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';
import "katex/dist/katex.min.css";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizData {
  title: string;
  description: string;
  questions: Question[];
}

interface QuizProps {
  quizData: QuizData;
}

export const Quiz = ({ quizData }: QuizProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentQuestion = quizData.questions[currentIndex];

  const handleSubmit = () => {
    const answerIndex = parseInt(selected);
    setAnswers([...answers, answerIndex]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex < quizData.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected('');
      setShowFeedback(false);
    } else {
      setCompleted(true);
    }
  };

  const score = answers.filter((answer, i) => answer === quizData.questions[i].correct).length;

  useEffect(() => {
    if (completed) {
      localStorage.setItem(`quiz-${quizData.title}`, JSON.stringify({
        score,
        total: quizData.questions.length,
        completedAt: new Date().toISOString()
      }));
    }
  }, [completed, score, quizData.title, quizData.questions.length]);

  if (completed) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">Your score: {score}/{quizData.questions.length}</p>
          <div className="space-y-2">
            {quizData.questions.map((q, i) => (
              <div key={i} className="p-3 rounded border">
                <div className="font-medium"><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} >{q.question}</ReactMarkdown></div>
                <div className={`text-sm ${answers[i] === q.correct ? 'text-green-600' : 'text-red-600'}`}>
                  Your answer: <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} >{q.options[answers[i]]}</ReactMarkdown>
                </div>
                <div className="text-sm text-muted-foreground"><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} >{q.explanation}</ReactMarkdown></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>{quizData.title}</CardTitle>
        <p className="text-muted-foreground">{quizData.description}</p>
        <p className="text-sm">Question {currentIndex + 1} of {quizData.questions.length}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-lg font-medium"><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} >{currentQuestion.question}</ReactMarkdown></div>
        <RadioGroup value={selected} onValueChange={setSelected} disabled={showFeedback}>
          {currentQuestion.options.map((option, i) => (
            <div key={i} className="flex items-center space-x-2">
              <RadioGroupItem value={i.toString()} id={`option-${i}`} />
              <Label htmlFor={`option-${i}`}><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} >{option}</ReactMarkdown></Label>
            </div>
          ))}
        </RadioGroup>
        {!showFeedback ? (
          <Button onClick={handleSubmit} disabled={!selected}>Submit Answer</Button>
        ) : (
          <div className="space-y-2">
            {parseInt(selected) === currentQuestion.correct ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>Correct!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="w-5 h-5" />
                <span>Incorrect. The correct answer is: {currentQuestion.options[currentQuestion.correct]}</span>
              </div>
            )}
            <div className="text-sm text-muted-foreground"><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} >{currentQuestion.explanation}</ReactMarkdown></div>
            <Button onClick={handleNext}>Next Question</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};