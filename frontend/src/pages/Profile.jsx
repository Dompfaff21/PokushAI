import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as PersonalInfoIcon } from '../svg/personal-info.svg';
import { ReactComponent as ShieldIcon } from '../svg/shield.svg';
import { ReactComponent as MyRecipeIcon } from '../svg/myrecipe.svg';
import { ReactComponent as SubIcon } from '../svg/sub.svg';
import { ReactComponent as LoginIcon } from '../svg/login_dark.svg';
import { ReactComponent as MailIcon } from '../svg/mail_dark.svg';
import { ReactComponent as PhoneIcon } from '../svg/phone_dark.svg';
import { ReactComponent as EyeDarkIcon } from '../svg/eye_dark.svg';
import { ReactComponent as HideEyeDarkIcon } from '../svg/hide_eye_dark.svg';
import AvatarCropper from '../components/Layout/AvatarCropper';
import '../css/Profile.css';

const API_BASE_URL = 'http://localhost:8000/api/v1/users';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal-info');
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword1: false,
    newPassword2: false
  });
  const [user, setUser] = useState({
    username: '',
    email: '',
    phone: '',
    image: '',
    posts: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword1: '',
    newPassword2: ''
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const fetchUserProfile = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/signup');
      return;
    }

    try {
      const headers = getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/user/profile/${userId}/`, {
        headers,
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Ошибка загрузки профиля');
      
      const userData = await response.json();
      setUser(prev => ({
        ...prev,
        username: userData.username,
        email: userData.email,
        phone: userData.phone || '',
        image: userData.image || ''
      }));
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }, [navigate]);

  const fetchUserPosts = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const headers = getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/user/posts/`, {
        headers,
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Ошибка загрузки постов');
      
      const posts = await response.json();
      const userPosts = posts.filter(post => post.author.id === parseInt(userId));
      setUser(prev => ({ ...prev, posts: userPosts }));
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }, []);

  useEffect(() => {
    const savedTab = localStorage.getItem('activeTabIndex');
    const initialTab = savedTab ? 
      ['personal-info', 'security-info', 'posts-info', 'subscription-info'][savedTab] : 
      'personal-info';
    
    setActiveTab(initialTab);
    fetchUserProfile();
    
    if (initialTab === 'posts-info') {
      fetchUserPosts();
    }
  }, [fetchUserProfile, fetchUserPosts]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(prevTab => {
      if (prevTab === tab) return prevTab;
      
      const tabIndex = ['personal-info', 'security-info', 'posts-info', 'subscription-info'].indexOf(tab);
      localStorage.setItem('activeTabIndex', tabIndex);
      
      if (tab === 'posts-info') {
        fetchUserPosts();
      }
      
      return tab;
    });
  }, [fetchUserPosts]);

  const togglePasswordVisibility = useCallback((field) => {
    setShowPassword(prev => ({...prev, [field]: !prev[field]}));
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!passwordForm.oldPassword || !passwordForm.newPassword1 || !passwordForm.newPassword2) {
      alert('Все поля пароля должны быть заполнены');
      return;
    }

    if (passwordForm.newPassword1 !== passwordForm.newPassword2) {
      alert('Новые пароли не совпадают');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/profile/password_update/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({
          old_password: passwordForm.oldPassword,
          new_password1: passwordForm.newPassword1,
          new_password2: passwordForm.newPassword2
        }),
        credentials: 'include'
      });

        // Обработка ошибок сервера
      if (response.status === 400) {
        const errorData = await response.json();
        const errorMessage = Object.values(errorData).flat().join('\n');
        throw new Error(errorMessage);
      }

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      alert('Пароль успешно изменен');
      setPasswordForm({ oldPassword: '', newPassword1: '', newPassword2: '' });
    } catch (error) {
      alert(error.message);
    }
  }, [passwordForm]);

  const handleProfileSubmit = useCallback(async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('phone', user.phone);

    try {
      const headers = {
        ...getAuthHeader(),
      };
      
      const response = await fetch(`${API_BASE_URL}/user/profile/update/`, {
        method: 'PATCH',
        headers,
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка обновления профиля');
      }

      const updatedUser = await response.json();
      console.log('updatedUser:', updatedUser);
      setUser(prev => ({
        ...prev,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone || ''
      }));

      alert('Профиль успешно обновлен');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const handleCropComplete = useCallback(async (file) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const headers = {
        ...getAuthHeader(),
      };
      
      const response = await fetch(`${API_BASE_URL}/user/profile/update/`, {
        method: 'PATCH',
        headers,
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Ошибка обновления аватара');
      }

      const updatedUser = await response.json();
      setUser(prev => ({
        ...prev,
        image: updatedUser.image || ''
      }));
      alert('Аватар успешно обновлен');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteAvatarRequest = useCallback(async () => {
    if (!window.confirm('Вы уверены, что хотите удалить аватар?')) return;
    
    setIsLoading(true);
    try {
      const headers = getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/user/profile/image_delete/`, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Ошибка удаления аватара');
      }

      setUser(prev => ({ ...prev, image: '' }));
      alert('Аватар успешно удален');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
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
          <div id="personal-info" className="content-box" style={{display: activeTab === 'personal-info' ? 'block' : 'none'}}>
            <h1>Профиль {user.username}</h1>
            <form onSubmit={handleProfileSubmit}>
              <AvatarCropper 
                currentAvatar={user.image}
                onCropComplete={handleCropComplete}
                onDeleteAvatar={handleDeleteAvatarRequest}
              />
              
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
                  value={user.phone}
                  onChange={(e) => setUser(prev => ({...prev, phone: e.target.value}))}
                />
                <label className="form-label">Номер телефона</label>
                <div className="svg-icon">
                  <PhoneIcon />
                </div>
              </div>
              
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Сохранение...' : 'Изменить данные'}
              </button>
            </form>
          </div>

          <div id="security-info" className="content-box" style={{display: activeTab === 'security-info' ? 'block' : 'none'}}>
            <h1>Безопасность и вход</h1>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <input 
                  type={showPassword.oldPassword ? "text" : "password"}
                  name="oldPassword"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
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
                  name="newPassword1"
                  value={passwordForm.newPassword1}
                  onChange={handlePasswordChange}
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
                  name="newPassword2"
                  value={passwordForm.newPassword2}
                  onChange={handlePasswordChange}
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

          <div id="posts-info" className="content-box" style={{display: activeTab === 'posts-info' ? 'block' : 'none'}}>
            <h1 className="recipe_title">Мои рецепты</h1>
            {user.posts.length > 0 ? (
              user.posts.map(post => (
                <div className="container2" id="recipes_author" key={post.id}>
                  <img 
                    className="post_img" 
                    src={post.image || '/pictures/nophoto.svg'} 
                    alt={post.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/pictures/nophoto.svg';
                    }}
                  />
                  <img 
                    className="user_avatar" 
                    src={user.image || '/pictures/no_photo.png'} 
                    alt="Аватар"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/pictures/no_photo.png';
                    }}
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
                    <EyeDarkIcon />
                    <span>{post.views}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>Вы еще не добавляли свои рецепты</p>
            )}
          </div>

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