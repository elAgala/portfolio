import './hero.styles.scss';

// const transition = {
//   duration: 0.8,
//   delay: 0.2,
//   ease: [0, 0.71, 0.2, 1.01]
// }


export function Hero() {
  return (
    <section className="hero">
      <div className="hero__content visible">
        <div className="hero__text-container">
          {/* <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={transition}> */}
          {/*   Julian */}
          {/* </motion.span> */}
          {/* <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}> */}
          {/*   Benitez */}
          {/* </motion.span> */}
          <h1 className="hero__title">
            <span className="hero__title-word">Julian</span>
            <span className="hero__title-word">Benitez</span>
          </h1>
          <div className="hero__subtitle-container">
            <h3 className="hero__subtitle">Software Engineer</h3>
            <div className="hero__subtitle-line"></div>
          </div>
        </div>
        <div className="hero__background">
          <div className="hero__gradient"></div>
          <div className="hero__particles">
            {[...Array(20)].map((_, index) => (
              <div key={index} className="hero__particle"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
