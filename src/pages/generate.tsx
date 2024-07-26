import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import styles from "../styles/Generate.module.css";
import Lottie from "lottie-react";
import wrongAnimation from "../../public/wrong.json";
import correctAnimation from "../../public/correct.json";

const loadingMessages = [
  "Patience is virtue...",
  "Loading sucks we know.. TwT",
  "Generating good stuff...",
  "Good things take time.. ;)",
];

type QuizData = {
  question: string;
  options: string[];
  correctAnswer: number;
};

const GeneratePage: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timer, setTimer] = useState(10);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessage(
          loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
        );
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    if (quizData && !showAnswer) {
      const timerInterval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(timerInterval);
            setShowAnswer(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [quizData, showAnswer]);

  useEffect(() => {
    const dateTimeInterval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(dateTimeInterval);
  }, []);

  const handleGenerate = async () => {
    setIsLoading(true);
    setQuizData(null);
    setShowAnswer(false);
    // Simulating API call
    setTimeout(() => {
      // Replace this with actual API call
      const mockQuizData: QuizData = {
        question: "Which data structure follows the FIFO principle?",
        options: ["Stack", "Queue", "Array", "Linked List"],
        correctAnswer: 1,
      };
      setQuizData(mockQuizData);
      setIsLoading(false);
      setTimer(10);
    }, 5000);
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowAnswer(true);
  };

  return (
    <div className={styles.generatePage}>
      <div className={styles.navbarWrapper}>
        <Navbar />
      </div>
      {!isLoading && !quizData && (
        <div className={styles.content}>
          <div className={styles.rectangleParent}>
            <svg
              width="21"
              height="23"
              viewBox="0 0 21 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.6698 0L10.8638 0.931968C11.9152 5.98385 15.7396 10.003 20.7331 11.3038C15.7396 12.6047 11.9152 16.6238 10.8638 21.6757L10.6698 22.6077L10.4758 21.6757C9.42432 16.6238 5.59992 12.6047 0.606445 11.3038C5.59992 10.003 9.42432 5.98385 10.4758 0.931968L10.6698 0Z"
                fill="black"
              />
            </svg>

            <div className={styles.geninput1}>Education with AI</div>
          </div>
          <h1 className={styles.heroheader}>Learn With AI</h1>
          <p className={styles.herodescribe}>
            Your ultimate guide to learning with AI
          </p>
          <div className={styles.homeinput}>
            <input
              type="text"
              className={styles.geninput}
              placeholder="Enter a topic or an idea..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button className={styles.genbutton} onClick={handleGenerate}>
              Generate
            </button>
          </div>
        </div>
      )}
      {isLoading && (
        <div className={styles.loadingContainer}>
          <p className={styles.loadingMessage}>{loadingMessage}</p>
        </div>
      )}
      {quizData && (
        <div
          className={`${styles.quizContainer} ${
            showAnswer ? styles.flipped : ""
          }`}
        >
          <div className={styles.cardFront}>
            <h2 className={styles.question}>{quizData.question}</h2>
            {quizData.options.map((option, index) => (
              <div
                key={index}
                className={`${styles.option} ${
                  selectedAnswer === index ? styles.selected : ""
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <span className={styles.optionNumber}>{index + 1}</span>
                <span className={styles.optionText}>{option}</span>
              </div>
            ))}
            <div className={styles.timerAndDate}>
              <span className={styles.timer}>{timer}s</span>
              <span className={styles.dateTime}>
                {currentDateTime.toLocaleString()}
              </span>
            </div>
          </div>
          <div className={styles.cardBack}>
            {selectedAnswer === quizData.correctAnswer ? (
              <div className={styles.correctAnswer}>
                <h2 className={styles.answerResult}>Correct Answer</h2>
                <div className={styles.wrongIcon}>
                  <Lottie
                    animationData={correctAnimation}
                    loop={true}
                    style={{ width: 200, height: 200 }}
                  />
                </div>
                <div className={styles.correctOption}>
                  <div className={styles.optionBackground}>
                    <span>{quizData.options[quizData.correctAnswer]}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.correctAnswer}>
                <h2 className={styles.answerResult}>Wrong Answer</h2>
                <div className={styles.wrongIcon}>
                  <Lottie
                    animationData={wrongAnimation}
                    loop={true}
                    style={{ width: 200, height: 200 }}
                  />
                </div>
                <h3 className={styles.correctAnswerTitle}>Correct Answer</h3>
                <div className={styles.correctOption}>
                  <div className={styles.optionBackground}>
                    <span>{quizData.options[quizData.correctAnswer]}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <p className={styles.disclaimer}>
        AI results may not be accurate. Please ensure to not consider it as real
        information at all times.
      </p>
    </div>
  );
};

export default GeneratePage;
