import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as LoginIcon } from '../svg/login_dark.svg';
import { ReactComponent as PhoneIcon } from '../svg/phone_dark.svg';
import { ReactComponent as MailIcon } from '../svg/mail_dark.svg';
import { ReactComponent as ShowEyeIcon } from '../svg/eye_dark.svg';
import { ReactComponent as HideEyeIcon } from '../svg/hide_eye_dark.svg';
import '../css/SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(() => {
    return localStorage.getItem('containerState') === 'active';
  });
  
  const phoneInputRef = useRef(null);
  
  const [signUpForm, setSignUpForm] = useState({
    username: '',
    phone: '+7 (',
    email: '',
    password1: '',
    password2: ''
  });
  
  const [signInForm, setSignInForm] = useState({
    name: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    password1: false,
    password2: false
  });

  useEffect(() => {
    if (isSignUp && phoneInputRef.current) {
      phoneInputRef.current.focus();
      const len = phoneInputRef.current.value.length;
      phoneInputRef.current.setSelectionRange(len, len);
    }
  }, [isSignUp]);

  const handleToggle = (isActive) => {
    setIsSignUp(isActive);
    localStorage.setItem('containerState', isActive ? 'active' : '');
  };

  const formatPhone = (value) => {
    // Удаляем все нецифровые символы, кроме +
    let numbers = value.replace(/[^\d+]/g, '');
    
    // Если номер не начинается с +7, добавляем +7
    if (!numbers.startsWith('+7')) {
      numbers = '+7' + numbers.replace(/[^\d]/g, '');
    }
    
    // Ограничиваем длину номера (11 цифр после +7)
    numbers = numbers.substring(0, 12);
    
    // Форматируем номер
    let formatted = numbers.substring(0, 2); // +7
    if (numbers.length > 2) {
      formatted += ' (' + numbers.substring(2, 5); // +7 (XXX
    }
    if (numbers.length > 5) {
      formatted += ') ' + numbers.substring(5, 8); // +7 (XXX) XXX
    }
    if (numbers.length > 8) {
      formatted += '-' + numbers.substring(8, 10); // +7 (XXX) XXX-XX
    }
    if (numbers.length > 10) {
      formatted += '-' + numbers.substring(10, 12); // +7 (XXX) XXX-XX-XX
    }
    
    return formatted;
  };

  const handlePhoneKeyDown = (e) => {
    // Разрешаем удаление только если курсор не в начале
    if (e.key === 'Backspace' && phoneInputRef.current.selectionStart <= 4) {
      e.preventDefault();
    }
    
    // Разрешаем только цифры, Backspace, Delete, стрелки
    if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|ArrowUp|ArrowDown/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatPhone(value);
    
    // Сохраняем позицию курсора
    const cursorPosition = e.target.selectionStart;
    const oldLength = e.target.value.length;
    
    setSignUpForm(prev => ({ ...prev, phone: formattedValue }));
    
    // Корректируем позицию курсора после обновления
    setTimeout(() => {
      if (phoneInputRef.current) {
        let newCursorPosition = cursorPosition;
        const newLength = formattedValue.length;
        
        // Если символ был удален
        if (newLength < oldLength) {
          newCursorPosition = Math.max(4, cursorPosition - (oldLength - newLength));
        } 
        // Если символ был добавлен
        else if (newLength > oldLength) {
          newCursorPosition = cursorPosition + (newLength - oldLength);
        }
        
        // Корректируем позицию для форматирующих символов
        if (formattedValue[newCursorPosition - 1] === ' ' || 
            formattedValue[newCursorPosition - 1] === '(' || 
            formattedValue[newCursorPosition - 1] === ')' ||
            formattedValue[newCursorPosition - 1] === '-') {
          newCursorPosition += 1;
        }
        
        phoneInputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      handlePhoneChange(e);
    } else {
      setSignUpForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInForm(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    
    const phoneToSend = signUpForm.phone.replace(/[^\d+]/g, '');
    
    if (!phoneToSend.startsWith('+7') || phoneToSend.length < 12) {
        alert('Пожалуйста, введите корректный номер телефона');
        return;
    }

    const formData = { 
        ...signUpForm, 
        phone: phoneToSend
    };
    
    console.log('Sign Up Submitted:', formData);
    navigate('/account');
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    console.log('Sign In Submitted:', signInForm);
    navigate('/account');
  };

  return (
    <div className="centerbox">
      <div className={`container ${isSignUp ? 'active' : ''}`} id="container">
        {/* Sign Up Form */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignUpSubmit}>
            <h1>Создать аккаунт</h1>
            <div className="social-icons">
              <a href="/" className="icons" style={{backgroundColor: '#28a7e8'}}>
                <i className='bx bxl-telegram'></i>
              </a>
              <a href="/" className="icons" style={{backgroundColor: '#0078ff'}}>
                <i className='bx bxl-vk'></i>
              </a>
              <a href="/" className="icons" style={{backgroundColor: '#3ae158'}}>
                <i className='bx bxl-whatsapp'></i>
              </a>
            </div>
            
            <div className="form-group">
              <input 
                type="text" 
                name="username" 
                value={signUpForm.username}
                onChange={handleSignUpChange}
                required 
                placeholder=" "
              />
              <label className="form-label">Логин</label>
              <div className="svg-icon">
                <LoginIcon />
              </div>
            </div>
            
            <div className="form-group">
              <input 
                type="tel" 
                name="phone" 
                value={signUpForm.phone}
                onChange={handleSignUpChange}
                onKeyDown={handlePhoneKeyDown}
                ref={phoneInputRef}
                required 
                placeholder=" "
                className="phone-input"
              />
              <label className="form-label">Номер телефона</label>
              <div className="svg-icon">
                <PhoneIcon />
              </div>
            </div>
            
            <div className="form-group">
              <input 
                type="email" 
                name="email" 
                value={signUpForm.email}
                onChange={handleSignUpChange}
                required 
                placeholder=" "
              />
              <label className="form-label">E-mail</label>
              <div className="svg-icon">
                <MailIcon />
              </div>
            </div>
            
            <div className="form-group">
              <input 
                type={showPassword.password1 ? "text" : "password"}
                name="password1" 
                value={signUpForm.password1}
                onChange={handleSignUpChange}
                required 
                placeholder=" "
              />
              <label className="form-label">Пароль</label>
              <div className="eye" onClick={() => togglePasswordVisibility('password1')}>
                {showPassword.password1 ? <HideEyeIcon /> : <ShowEyeIcon />}
              </div>
            </div>
            
            <div className="form-group">
              <input 
                type={showPassword.password2 ? "text" : "password"}
                name="password2" 
                value={signUpForm.password2}
                onChange={handleSignUpChange}
                required 
                placeholder=" "
              />
              <label className="form-label">Повторите пароль</label>
              <div className="eye" onClick={() => togglePasswordVisibility('password2')}>
                {showPassword.password2 ? <HideEyeIcon /> : <ShowEyeIcon />}
              </div>
            </div>
            
            <button type="submit">Зарегистрироваться</button>
          </form>
        </div>
        
        {/* Sign In Form */}
        <div className="form-container sign-in">
          <form onSubmit={handleSignInSubmit}>
            <h1>Вход в аккаунт</h1>
            <div className="social-icons">
              <a href="/" className="icons" style={{backgroundColor: '#28a7e8'}}>
                <i className='bx bxl-telegram'></i>
              </a>
              <a href="/" className="icons" style={{backgroundColor: '#0078ff'}}>
                <i className='bx bxl-vk'></i>
              </a>
              <a href="/" className="icons" style={{backgroundColor: '#3ae158'}}>
                <i className='bx bxl-whatsapp'></i>
              </a>
            </div>
            
            <div className="form-group">
              <input 
                type="text" 
                name="name" 
                value={signInForm.name}
                onChange={handleSignInChange}
                required 
                placeholder=" "
              />
              <label className="form-label">Логин</label>
              <div className="svg-icon">
                <LoginIcon />
              </div>
            </div>
            
            <div className="form-group">
              <input 
                type={showPassword.password ? "text" : "password"}
                name="password" 
                value={signInForm.password}
                onChange={handleSignInChange}
                required 
                placeholder=" "
              />
              <label className="form-label">Пароль</label>
              <div className="eye" onClick={() => togglePasswordVisibility('password')}>
                {showPassword.password ? <HideEyeIcon /> : <ShowEyeIcon />}
              </div>
            </div>
            
            <a href="/password-reset">Забыли пароль?</a>
            <button type="submit">Войти</button>
          </form>
        </div>

        {/* Toggle Container */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>ПокушAI</h1>
              <p>Уже есть аккаунт?</p>
              <button className="hidden" onClick={() => handleToggle(false)}>Войти</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Добро пожаловать</h1>
              <p>У вас еще нет аккаунта?</p>
              <button className="hidden" onClick={() => handleToggle(true)}>Зарегистрироваться</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;