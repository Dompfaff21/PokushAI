import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as LoginIcon } from '../svg/login_dark.svg';
import { ReactComponent as PhoneIcon } from '../svg/phone_dark.svg';
import { ReactComponent as MailIcon } from '../svg/mail_dark.svg';
import { ReactComponent as ShowEyeIcon } from '../svg/eye_dark.svg';
import { ReactComponent as HideEyeIcon } from '../svg/hide_eye_dark.svg';
import '../css/SignUp.css';
import { AuthContext } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:8000/api/v1/users';

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const phoneInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [forms, setForms] = useState({
    signUp: {
      username: '',
      phone: '+7 (',
      email: '',
      password1: '',
      password2: ''
    },
    signIn: {
      name: '',
      password: ''
    }
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

  const formatPhone = (value) => {
    let numbers = value.replace(/[^\d+]/g, '');
    
    if (!numbers.startsWith('+7')) {
      numbers = '+7' + numbers.replace(/^\+/, '');
    }
    
    numbers = numbers.substring(0, 12);
    
    if (numbers.length <= 2) return numbers;
    
    let formatted = numbers.substring(0, 2);
    if (numbers.length > 2) formatted += ' (' + numbers.substring(2, 5);
    if (numbers.length > 5) formatted += ') ' + numbers.substring(5, 8);
    if (numbers.length > 8) formatted += '-' + numbers.substring(8, 10);
    if (numbers.length > 10) formatted += '-' + numbers.substring(10, 12);
    
    return formatted;
  };

  const validateForm = (formName) => {
    const newErrors = {};
    const form = forms[formName];
    
    if (formName === 'signUp') {
      if (!form.username.trim()) newErrors.username = 'Введите логин';
      if (!form.email.includes('@')) newErrors.email = 'Некорректный email';
      
      const phoneDigits = form.phone.replace(/[^\d]/g, '');
      if (phoneDigits.length < 11) newErrors.phone = 'Некорректный номер';
      
      if (form.password1.length < 6) newErrors.password1 = 'Минимум 6 символов';
      if (form.password1 !== form.password2) newErrors.password2 = 'Пароли не совпадают';
    } else {
      if (!form.name.trim()) newErrors.name = 'Введите логин';
      if (!form.password) newErrors.password = 'Введите пароль';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (formName, e) => {
    const { name, value } = e.target;
    
    setForms(prev => ({
      ...prev,
      [formName]: {
        ...prev[formName],
        [name]: name === 'phone' ? formatPhone(value) : value
      }
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneKeyDown = (e) => {
    if (e.key === 'Backspace' && phoneInputRef.current.selectionStart <= 4) {
      e.preventDefault();
    }
    
    if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|ArrowUp|ArrowDown/.test(e.key)) {
      e.preventDefault();
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleRegister = async () => {
    try {
      const formattedPhone = forms.signUp.phone;
      const response = await fetch(`${API_BASE_URL}/user/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: forms.signUp.username,
          email: forms.signUp.email,
          password1: forms.signUp.password1,
          password2: forms.signUp.password2,
          phone: formattedPhone
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || JSON.stringify(errorData));
      }

      await handleLogin(forms.signUp.username, forms.signUp.password1);
    } catch (error) {
      setErrors(prev => ({ ...prev, form: error.message || 'Ошибка регистрации' }));
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка входа');
      }

      const data = await response.json();
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('token', data.access); 
      login(data.userId, username);
      navigate('/profile');
    } catch (error) {
      setErrors(prev => ({ ...prev, form: error.message || 'Ошибка входа' }));
    }
  };

  const handleSubmit = async (formName, e) => {
    e.preventDefault();
    if (!validateForm(formName)) return;
    
    setIsLoading(true);
    setErrors(prev => ({ ...prev, form: '' }));
    
    try {
      if (formName === 'signUp') {
        await handleRegister();
      } else {
        await handleLogin(forms.signIn.name, forms.signIn.password);
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, form: error.message || 'Произошла ошибка' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="centerbox">
      {errors.form && (
        <div className="messages-popup">
          <ul className="messages">
            <div className="error-message">{errors.form}</div>
            <span 
              className="close-button" 
              onClick={() => setErrors(prev => ({ ...prev, form: '' }))}
            >
              &times;
            </span>
          </ul>
        </div>
      )}
      
      <div className="auth-container">
        <div className="auth-switcher">
          <button 
            className={`auth-switch-btn ${!isSignUp ? 'active' : ''}`}
            onClick={() => setIsSignUp(false)}
            disabled={isLoading}
          >
            Вход
          </button>
          <button 
            className={`auth-switch-btn ${isSignUp ? 'active' : ''}`}
            onClick={() => setIsSignUp(true)}
            disabled={isLoading}
          >
            Регистрация
          </button>
        </div>

        {isSignUp ? (
          <form className="auth-form" onSubmit={(e) => handleSubmit('signUp', e)}>
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
                value={forms.signUp.username}
                onChange={(e) => handleChange('signUp', e)}
                required 
                placeholder=" "
                className={errors.username ? 'error' : ''}
              />
              <label className="form-label">Логин</label>
              <div className="svg-icon">
                <LoginIcon />
              </div>
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>
            
            <div className="form-group">
              <input 
                type="tel" 
                name="phone" 
                value={forms.signUp.phone}
                onChange={(e) => handleChange('signUp', e)}
                onKeyDown={handlePhoneKeyDown}
                ref={phoneInputRef}
                required 
                placeholder=" "
                className={`phone-input ${errors.phone ? 'error' : ''}`}
              />
              <label className="form-label">Номер телефона</label>
              <div className="svg-icon">
                <PhoneIcon />
              </div>
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
            
            <div className="form-group">
              <input 
                type="email" 
                name="email" 
                value={forms.signUp.email}
                onChange={(e) => handleChange('signUp', e)}
                required 
                placeholder=" "
                className={errors.email ? 'error' : ''}
              />
              <label className="form-label">E-mail</label>
              <div className="svg-icon">
                <MailIcon />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <input 
                type={showPassword.password1 ? "text" : "password"}
                name="password1" 
                value={forms.signUp.password1}
                onChange={(e) => handleChange('signUp', e)}
                required 
                placeholder=" "
                className={errors.password1 ? 'error' : ''}
              />
              <label className="form-label">Пароль</label>
              <div className="eye" onClick={() => togglePasswordVisibility('password1')}>
                {showPassword.password1 ? <HideEyeIcon /> : <ShowEyeIcon />}
              </div>
              {errors.password1 && <span className="error-text">{errors.password1}</span>}
            </div>
            
            <div className="form-group">
              <input 
                type={showPassword.password2 ? "text" : "password"}
                name="password2" 
                value={forms.signUp.password2}
                onChange={(e) => handleChange('signUp', e)}
                required 
                placeholder=" "
                className={errors.password2 ? 'error' : ''}
              />
              <label className="form-label">Повторите пароль</label>
              <div className="eye" onClick={() => togglePasswordVisibility('password2')}>
                {showPassword.password2 ? <HideEyeIcon /> : <ShowEyeIcon />}
              </div>
              {errors.password2 && <span className="error-text">{errors.password2}</span>}
            </div>
            
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={(e) => handleSubmit('signIn', e)}>
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
                value={forms.signIn.name}
                onChange={(e) => handleChange('signIn', e)}
                required 
                placeholder=" "
                className={errors.name ? 'error' : ''}
              />
              <label className="form-label">Логин</label>
              <div className="svg-icon">
                <LoginIcon />
              </div>
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <input 
                type={showPassword.password ? "text" : "password"}
                name="password" 
                value={forms.signIn.password}
                onChange={(e) => handleChange('signIn', e)}
                required 
                placeholder=" "
                className={errors.password ? 'error' : ''}
                autoComplete="new-password"
                autoCorrect="off"
                spellCheck="false"
              />
              <label className="form-label">Пароль</label>
              <div className="eye" onClick={() => togglePasswordVisibility('password')}>
                {showPassword.password ? <HideEyeIcon /> : <ShowEyeIcon />}
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            
            <a href="/password-reset">Забыли пароль?</a>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Загрузка...' : 'Войти'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;