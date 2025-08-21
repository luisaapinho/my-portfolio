import { RoughNotation, RoughNotationGroup } from 'react-rough-notation';
import { useInView } from 'react-intersection-observer';
import './AboutMe.css';
import HighlightText from './highlightText';
import useSequentialShow from './useSequentialShow';
import { useState, useEffect } from 'react';

export default function AboutMe() {
  const { ref, inView } = useInView({ threshold: 0.3 });
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    if (inView && !startAnimation) {
      setStartAnimation(true);
    }
  }, [inView, startAnimation]);

  const delay = 1500;

  return (
    <section className="about-me-section" ref={ref}>
      <h2 className="about-me-title">ABOUT ME</h2>

      <div className="about-me-content">
        <div className="about-me-image">
          <img
            src="/assets/animation-about-me.gif"
            alt="Luisa animated illustration - My life in Brazil and Portugal"
          />
        </div>

        <div className="about-me-text">
          <RoughNotationGroup show={false}>
            <p>
              Hello, I’m{' '}
              <RoughNotation type="circle" color="#AF431C" show={useSequentialShow(startAnimation, 0 * delay)}>Luisa</RoughNotation>{' '}
              — an aspiring{' '}
              <RoughNotation type="underline" color="#AF431C" show={useSequentialShow(startAnimation, 1 * delay)}>UI/UX designer</RoughNotation>{' '}
              who knows a little bit of{' '}
              <HighlightText noWrap delay={2 * delay} active={startAnimation}>code</HighlightText> too.  
              I recently finished my{' '}
              <RoughNotation type="box" color="#AF431C" show={useSequentialShow(startAnimation, 3 * delay)}>bachelor’s degree</RoughNotation>{' '}
              and I’m currently{' '}
              <RoughNotation type="underline" color="#AF431C" show={useSequentialShow(startAnimation, 4 * delay)}>looking for work</RoughNotation>{' '}
              in the UI/UX field, with a special love for{' '}
              <RoughNotation type="circle" color="#AF431C" show={useSequentialShow(startAnimation, 5 * delay)}>user experience</RoughNotation>.
            </p>

            <p>
              As shown in the gif, I was born in{' '}
              <HighlightText  noWrap delay={6 * delay} active={startAnimation}>São Paulo, Brazil</HighlightText>, where I was introduced to{' '}
              <RoughNotation type="underline" color="#AF431C" show={useSequentialShow(startAnimation, 7 * delay)}>art and performance</RoughNotation>{' '}
              from a very young age. I started working as a model at age 2 and spent much of my childhood doing theater. At 14, I moved to{' '}
              <HighlightText noWrap delay={8 * delay} active={startAnimation}>Porto, Portugal</HighlightText>, an experience that completely changed my{' '}
              <RoughNotation type="circle" color="#AF431C" show={useSequentialShow(startAnimation, 9 * delay)}>perspective</RoughNotation>.
            </p>

            <p>
              In university, while studying code, I reconnected with my creative side through{' '}
              <RoughNotation type="underline" color="#AF431C" show={useSequentialShow(startAnimation, 10 * delay)}>design</RoughNotation>.That moment made it clear: I had found the perfect bridge between{' '}
             <HighlightText noWrap  delay={11 * delay} active={startAnimation} >logic</HighlightText>  and <HighlightText  delay={11 * delay} active={startAnimation}>emotion.</HighlightText>
            </p>

            <p>
              This website is a{' '}
              <RoughNotation type="box" color="#AF431C" show={useSequentialShow(startAnimation, 12 * delay)}>personal project</RoughNotation>, both{' '}
              <RoughNotation type="underline" color="#AF431C" show={useSequentialShow(startAnimation, 13 * delay)}>coded and designed by me</RoughNotation>, to practice the skills I learned.
            </p>

            <p>
              Outside of tech, I love{' '}
              <RoughNotation type="circle" color="#AF431C" show={useSequentialShow(startAnimation, 14 * delay)}>scrapbooking</RoughNotation> and{' '}
              <RoughNotation type="circle" color="#AF431C" show={useSequentialShow(startAnimation, 15 * delay)}>crochet</RoughNotation> — little hobbies that help me{' '}
              <HighlightText noWrap delay={16 * delay} active={startAnimation}>slow down and enjoy the process</HighlightText>.
            </p>

            <p>
              Got an{' '}
              <RoughNotation type="box" color="#AF431C" show={useSequentialShow(startAnimation, 17 * delay)}>exciting idea</RoughNotation>, a{' '}
              <RoughNotation type="circle" color="#AF431C" show={useSequentialShow(startAnimation, 18 * delay)}>job</RoughNotation>, or just want to{' '}
              <RoughNotation type="underline" color="#AF431C" show={useSequentialShow(startAnimation, 19 * delay)}>say hi</RoughNotation>?{' '}
              <HighlightText  noWrap delay={20 * delay} active={startAnimation}>Contact me!</HighlightText>
            </p>
          </RoughNotationGroup>
        </div>
      </div>
    </section>
  );
}
