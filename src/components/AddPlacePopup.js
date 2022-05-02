import React from "react";
import PopupWithForm from "./PopupWithForm";
 

function AddPlacePopup(props) {
  const { isOpen, onClose, onUpdateCard } = props;
  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");
   

  function nameChange(e) {
    setName(e.target.value);
  }
  function linkChange(e) {
    setLink(e.target.value);
  }
  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    onUpdateCard({
      name,
      link
    });
    setName("");
    setLink("");
  }

   
    return(
    <PopupWithForm
        name="add"
        title="Новое место"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        buttonText="Сохранить"
      >
        <h2 className="popup__title">Новое место</h2>
        <input
          className="popup__input popup__input_type_name"
          id="card-input"
          name="inputFormName"
          type="text"
          maxLength="30"
          minLength="2"
          placeholder="Место"
          onChange={nameChange}
          value={name}
          required
        />
        <span className="popup__error" id="card-input-error"></span>
        <input
          className="popup__input popup__input_type_link"
          id="link-input"
          name="inputFormAddition"
          type="url"
          placeholder="Ссылка"
          onChange={linkChange}
          value={link}
          required
        />
        <span className="popup__error" id="link-input-error"></span>
        
      </PopupWithForm>)
}
export default AddPlacePopup;