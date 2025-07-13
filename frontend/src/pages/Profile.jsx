import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import userData from '../data/user.json';
import { ReactComponent as PersonalInfoIcon } from '../svg/personal-info.svg';
import { ReactComponent as ShieldIcon } from '../svg/shield.svg';
import { ReactComponent as MyRecipeIcon } from '../svg/myrecipe.svg';
import { ReactComponent as SubIcon } from '../svg/sub.svg';
import { ReactComponent as LoginIcon } from '../svg/login_dark.svg';
import { ReactComponent as MailIcon } from '../svg/mail_dark.svg';
import { ReactComponent as PhoneIcon } from '../svg/phone_dark.svg';
import { ReactComponent as EyeDarkIcon } from '../svg/eye_dark.svg';
import { ReactComponent as HideEyeDarkIcon } from '../svg/hide_eye_dark.svg';
import '../css/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal-info');
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword1: false,
    newPassword2: false
  });
  const [user, setUser] = useState({
    ...userData,
    posts: []
  });

  // Заглушка для постов
  const mockPosts = useCallback(() => [
    {
      id: 1,
      title: "Тестовый рецепт 1",
      description: "Описание тестового рецепта",
      created_at: "2023-05-15",
      likes: 5,
      views: 20,
      is_updated: false
    },
    {
      id: 2,
      title: "Тестовый рецепт 2",
      description: "Еще одно описание",
      created_at: "2023-06-20",
      likes: 10,
      views: 35,
      is_updated: true,
      update_at: "2023-06-22"
    }
  ], []);

  useEffect(() => {
    // Имитация загрузки данных пользователя
    const savedTab = localStorage.getItem('activeTabIndex');
    if (savedTab) {
      const tabs = ['personal-info', 'security-info', 'posts-info', 'subscription-info'];
      setActiveTab(tabs[savedTab] || 'personal-info');
    }
    
    // Имитация загрузки постов пользователя
    setTimeout(() => {
      setUser(prev => ({...prev, posts: mockPosts()}));
    }, 500);
  }, [mockPosts]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    const tabIndex = ['personal-info', 'security-info', 'posts-info', 'subscription-info'].indexOf(tab);
    localStorage.setItem('activeTabIndex', tabIndex);
  }, []);

  const togglePasswordVisibility = useCallback((field) => {
    setShowPassword(prev => ({...prev, [field]: !prev[field]}));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    console.log('Форма отправлена');
  }, []);

  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUser(prev => ({...prev, avatar: event.target.result}));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }, []);

  const handleDeleteAvatar = useCallback(() => {
    setUser(prev => ({...prev, avatar: ''}));
  }, []);

  const handleLike = useCallback((postId) => {
    console.log('Лайк', postId);
  }, []);

  const handleDeletePost = useCallback((postId) => {
    console.log('Удалить пост', postId);
  }, []);

  const handleEditPost = useCallback((postId) => {
    navigate(`/edit-post/${postId}`);
  }, [navigate]);

  return (
    <div className="centerbox1">
      <aside className="sidebarp">
        <ul>
          <li 
            className={activeTab === 'personal-info' ? 'active' : ''} 
            onClick={() => handleTabChange('personal-info')}
          >
            <div className="svg-li1">
              <PersonalInfoIcon />
            </div>
            Личные данные
          </li>
          <li 
            className={activeTab === 'security-info' ? 'active' : ''} 
            onClick={() => handleTabChange('security-info')}
          >
            <div className="svg-li">
              <ShieldIcon />
            </div>
            Безопасность и вход
          </li>
          <li 
            className={activeTab === 'posts-info' ? 'active' : ''} 
            onClick={() => handleTabChange('posts-info')}
          >
            <div className="svg-li">
              <MyRecipeIcon />
            </div>
            Мои рецепты
          </li>
          <li 
            className={activeTab === 'subscription-info' ? 'active' : ''} 
            onClick={() => handleTabChange('subscription-info')}
          >
            <div className="svg-li">
              <SubIcon />
            </div>
            Подписка
          </li>
        </ul>
      </aside>
      
      <div className={`container1 ${activeTab === 'posts-info' ? 'no-background' : ''}`}>
        <div className="content">
          {/* Личные данные */}
          <div id="personal-info" className="content-box" style={{display: activeTab === 'personal-info' ? 'block' : 'none'}}>
            <h1>Профиль {user.username}</h1>
            <form onSubmit={handleSubmit}>
              <div className="avatar">
                <img 
                  id="preview" 
                  src={user.avatar || '/pictures/no_photo.png'} 
                  alt="Ваше изображение"
                />
                <input 
                  type="file" 
                  name="image" 
                  id="id_image" 
                  onChange={handleFileChange}
                />
                <button type="button" onClick={handleDeleteAvatar}>
                  Удалить аватар
                </button>
              </div>
              
              <div className="form-group">
                <input 
                  type="text" 
                  name="username" 
                  value={user.username}
                  onChange={(e) => setUser(prev => ({...prev, username: e.target.value}))}
                  required 
                />
                <label className="form-label">Логин</label>
                <div className="svg-icon">
                  <LoginIcon />
                </div>
              </div>
              
              <div className="form-group">
                <input 
                  type="email" 
                  name="email" 
                  value={user.email}
                  onChange={(e) => setUser(prev => ({...prev, email: e.target.value}))}
                  required 
                />
                <label className="form-label">E-mail</label>
                <div className="svg-icon">
                  <MailIcon />
                </div>
              </div>
              
              <div className="form-group">
                <input 
                  type="tel" 
                  name="phone" 
                  value={user.phone || ''}
                  onChange={(e) => setUser(prev => ({...prev, phone: e.target.value}))}
                />
                <label className="form-label">Номер телефона</label>
                <div className="svg-icon">
                  <PhoneIcon />
                </div>
              </div>
              
              <button type="submit">Изменить данные</button>
            </form>
          </div>

          {/* Безопасность и вход */}
          <div id="security-info" className="content-box" style={{display: activeTab === 'security-info' ? 'block' : 'none'}}>
            <h1>Безопасность и вход</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input 
                  type={showPassword.oldPassword ? "text" : "password"}
                  name="old_password"
                  placeholder=" "
                  required
                />
                <label className="form-label">Старый пароль</label>
                <div className="eye" onClick={() => togglePasswordVisibility('oldPassword')}>
                  {showPassword.oldPassword ? <HideEyeDarkIcon /> : <EyeDarkIcon />}
                </div>
              </div>
              
              <div className="form-group">
                <input 
                  type={showPassword.newPassword1 ? "text" : "password"}
                  name="new_password1"
                  placeholder=" "
                  required
                />
                <label className="form-label">Новый пароль</label>
                <div className="eye" onClick={() => togglePasswordVisibility('newPassword1')}>
                  {showPassword.newPassword1 ? <HideEyeDarkIcon /> : <EyeDarkIcon />}
                </div>
              </div>
              
              <div className="form-group">
                <input 
                  type={showPassword.newPassword2 ? "text" : "password"}
                  name="new_password2"
                  placeholder=" "
                  required
                />
                <label className="form-label">Повторите пароль</label>
                <div className="eye" onClick={() => togglePasswordVisibility('newPassword2')}>
                  {showPassword.newPassword2 ? <HideEyeDarkIcon /> : <EyeDarkIcon />}
                </div>
              </div>
              
              <button type="submit">Сменить пароль</button>
            </form>
          </div>

          {/* Мои рецепты */}
          <div id="posts-info" className="content-box" style={{display: activeTab === 'posts-info' ? 'block' : 'none'}}>
            <h1 className="recipe_title">Мои рецепты</h1>
            {user.posts.length > 0 ? (
              user.posts.map(post => (
                <div className="container2" id="recipes_author" key={post.id}>
                  <img 
                    className="post_img" 
                    src="/pictures/nophoto.svg" 
                    alt={post.title}
                  />
                  <img 
                    className="user_avatar" 
                    src={user.avatar || '/pictures/no_photo.png'} 
                    alt="Аватар"
                  />
                  <p className="post_author">{user.username}</p>
                  <p className="post_title">{post.title}</p>
                  <p className="post_description">{post.description}</p>
                  <p className="post_created_at">{post.created_at}</p>
                  {post.is_updated && (
                    <p className="post_updated_at">Изменено: {post.update_at}</p>
                  )}
                  <button className="buttona" onClick={() => handleEditPost(post.id)}>
                    Редактировать рецепт
                  </button>
                  <button className="buttona" onClick={() => handleDeletePost(post.id)}>
                    Удалить рецепт
                  </button>
                  <div className="like">
                    <button className="like-button" onClick={() => handleLike(post.id)}>
                      <img 
                        src="/pictures/like.svg" 
                        alt="Лайк" 
                        style={{cursor: 'pointer'}}
                      />
                    </button>
                    <span className="like-count">{post.likes}</span>
                  </div>
                  <div className="views">
                    <div className="svg-icon">
                      <EyeDarkIcon />
                    </div>
                    <span>{post.views}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>Вы еще не добавляли свои рецепты</p>
            )}
          </div>

          {/* Подписка */}
          <div id="subscription-info" className="content-box" style={{display: activeTab === 'subscription-info' ? 'block' : 'none'}}>
            <h1>Подписка</h1>
            <p>Информация о подписке будет здесь</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;