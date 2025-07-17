import React, { useRef, useState } from 'react';
import Cropper from 'react-cropper';
import '../../css/cropper.min.css';
import '../../css/Profile.css';

const AvatarCropper = ({ 
  currentAvatar,
  onCropComplete,
  onDeleteAvatar
}) => {
  const [src, setSrc] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Пожалуйста, выберите файл изображения (JPEG, PNG, WebP)');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setSrc(reader.result);
        setShowModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      cropper.getCroppedCanvas().toBlob((blob) => {
        if (!blob) return;
        
        // Определяем MIME-тип из исходного файла или используем image/jpeg по умолчанию
        const mimeType = blob.type || 'image/jpeg';
        const fileExt = mimeType.split('/')[1] || 'jpeg';
        
        const fileName = `avatar-${Date.now()}.${fileExt}`;
        const file = new File([blob], fileName, { type: mimeType });
        
        onCropComplete(file);
        setShowModal(false);
      });
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSrc(null); // СБРОС src ПРИ ЗАКРЫТИИ
  };

  return (
    <div className="avatar">
      <img
        src={currentAvatar || '/pictures/no_photo.png'}
        alt="Ваше изображение"
        onClick={() => fileInputRef.current.click()}
        className="avatar-preview" // Добавляем класс
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/pictures/no_photo.png';
        }}
      />
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      <button 
        type="button" 
        onClick={onDeleteAvatar}
        disabled={!currentAvatar}
        className={!currentAvatar ? 'disabled-button' : ''}
      >
        Удалить аватар
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            
            <Cropper
              ref={cropperRef}
              src={src}
              aspectRatio={1}
              viewMode={1}
              guides={true}
              minCropBoxWidth={100}
              minCropBoxHeight={100}
              style={{ height: 400, width: '100%' }}
            />
            
            <div className="modal-actions">
              <button onClick={handleCrop}>Обрезать и сохранить</button>
              <button onClick={() => handleCancel(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarCropper;