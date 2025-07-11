import React from 'react';
import '../css/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="name">
        <h1>ПокушAI</h1>
        <p>Кулинарное приложение с мобильной версией. Отличные блюда из подручных продуктов.</p>
        <a href="#next-section" className="scroll-button">
          <div className="arrow"></div>
        </a>
      </div>
      
      <div id="next-section" className="advantages">
        <h2>Почему мы?</h2>
        <div className="adv_row">
          <div className="adv_column">
            <img src="/pictures/index/adv1.svg" alt="Удобство и экономия времени" />
            <h3>Удобство и экономия времени</h3>
            <p>
              Наше приложение поможет пользователям быстро и легко выбрать блюда на основе имеющихся продуктов, 
              что позволит сэкономить время на походы в магазин и поиски рецептов.
            </p>
          </div>
          <div className="adv_column">
            <img src="/pictures/index/adv2.svg" alt="Персонализация" />
            <h3>Персонализация</h3>
            <p>
              Наша нейронная сеть предложит блюда именно на основе выбранных продуктов, 
              учитывая предпочтения пользователя и его диетические ограничения.
            </p>
          </div>
        </div>
        
        <div className="adv_row">
          <div className="adv_column">
            <img src="/pictures/index/adv3.svg" alt="Подробные инструкции" />
            <h3>Подробные инструкции</h3>
            <p>       
              В нашем приложении вы найдете подробные рецепты с пошаговыми инструкциями, 
              что сделает процесс приготовления блюд максимально понятным и простым.
            </p>
          </div>
          <div className="adv_column">
            <img src="/pictures/index/adv4.svg" alt="Удобный дизайн" />
            <h3>Удобный дизайн</h3>
            <p>
              Наше приложение разработано с учетом удобства использования, 
              что делает его привлекательным для всех категорий пользователей, вне зависимости от уровня опыта в кулинарии.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;