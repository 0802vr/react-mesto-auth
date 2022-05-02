import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import  SuccessAuto from "../image/Success.png"
import FailAuto from "../image/Fail.png"    
import { Route, Redirect, Switch, useHistory, BrowserRouter} from "react-router-dom";
import api from "../utils/Api";
import * as auto from "../utils/Auto.js";
import { CurrentUserContext } from "../context/CurrentUserContext";


function App() {

  const [isEditAvatarisPopupOpen, setEditAvatarisPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [cards, setCards] = React.useState([]);
  const [selectedCard, setSelectedCard] = React.useState({
    name: "",
    link: "",
  });
  const [currentUser, setCurrentUser] = React.useState({});
const history = useHistory();
const [loggedIn, setLoggedIn] = React.useState(false);
const [toolTip, setToolTip] = React.useState(toolTipFail);
const [email, setEmail] = React.useState("");
const [isSetTooltipOpen, setTooltipOpen] = React.useState(false);
 
const toolTipFail = {image: FailAuto, text:"Что-то пошло не так! Попробуйте ещё раз."};
const toolTipSuccess = {image: SuccessAuto, text:"Вы успешно зарегистрировались!"};


  const handleEditAvatarClick = () => {
    setEditAvatarisPopupOpen(true);
  };
  const handleEditProfileClick = () => {
    setEditProfilePopupOpen(true);
  };
  const handleAddPlaceClick = () => {
    setAddPlacePopupOpen(true);
  };
  const handleCardClick = (card) => {
    setSelectedCard({ name: card.name, link: card.link });
  };



  const closeAllPopups = () => {
    setEditAvatarisPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setSelectedCard({ link: "", name: "" });
    setTooltipOpen(false)
  };

  React.useEffect(() => {
    api
      .getUserInfo()
      .then((userInfo) => {
        setCurrentUser(userInfo);
      })

      .catch((err) => {
        console.log(err); // тут ловим ошибку
      });
  }, []);

  React.useEffect(() => {
    api
      .getInitialCards()
      .then((cardList) => {
        
        setCards(cardList);
      })

      .catch((err) => {
        console.log(err); // тут ловим ошибку
      });
  }, []);

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.card.likes.some((i) => i._id === currentUser._id);

    api.changeLikeCardStatus(card.card._id, !isLiked)
    .then((newCard) => {
      setCards((cards) =>
        cards.map((c) => (c._id === card.card._id ? newCard : c))
      
      
    )}
    )
    .catch((err) => {
      console.log(err); // тут ловим ошибку
    })
  }
  function handleCardDelete(card) {
    api
      .removeCard(card._id)
      .then(() => {
        setCards(cards.filter((element) => element !== card));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleUpdateUser(updateProfile) {
    api
      .editProfile(updateProfile.name, updateProfile.about)
      .then((newEdit) => {
        setCurrentUser(newEdit);
        closeAllPopups();
      })

      .catch((err) => {
        console.log(err); // тут ловим ошибку
      });
  }
  function handleUpdateAvatar({ avatar }) {
    api
      .addAvatar(avatar)
      .then((newAvatar) => {
        setCurrentUser(newAvatar);
        closeAllPopups();
      })

      .catch((err) => {
        console.log(err); // тут ловим ошибку
      });
  }
  function handleUpdateCard({ name, link }) {
    api
      .addCard({ name: name, link: link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })

      .catch((err) => {
        console.log(err); // тут ловим ошибку
      });
  }
   
 function toggleLogin() {
  loggedIn ? handleTokenOut(false) : setLoggedIn(true);
};

  React.useEffect(() => {
  const token = localStorage.getItem('token');
  auto.checkToken(token)
  .then(
    (res) => {
      if(res.data._id && res.data.email) {
        setEmail(res.data.email);
        setLoggedIn(true);
      }
    }
  )
  .catch((error) => {
     
      console.log(error);
    })
});  


  function handleTokenOut (){
    localStorage.removeItem("token");
    history.push("/sign-in");
  }

 function handleLogin ({email, password}){
auto.authorize({email:email, password:password})
.then (
  (res) => {
    localStorage.setItem('token', res.token);
    toggleLogin();
    setEmail(email);
    history.push("/");
  }
)
.catch((error) => {
     
  console.log(error);
}
)}

 function handleRegister ({email, password}){
   auto.register({email:email, password:password})
   .then (
    () => {
      setToolTip(toolTipSuccess);
      isSetTooltipOpen(true);
    }
  )
  .catch(() => {
    setToolTip(toolTipFail);
    isSetTooltipOpen(true);
  })
}


  return (
    <BrowserRouter>
    <div className="page">
    <CurrentUserContext.Provider value={{currentUser: currentUser,
       loggedIn: loggedIn,
       handleLogin: toggleLogin}}>
      
      <ProtectedRoute 
            exact path='/' component={Header} />
    
       
       
        <ProtectedRoute 
            exact path='/' component={EditProfilePopup}
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <ProtectedRoute 
            exact path='/' component={AddPlacePopup}
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onUpdateCard={handleUpdateCard}
        />

          <ProtectedRoute 
            exact path='/' component={EditAvatarPopup}
          isOpen={isEditAvatarisPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

          <ProtectedRoute 
            exact path='/' component={ImagePopup}
          name={selectedCard.name}
          link={selectedCard.link}
          onClose={closeAllPopups}
        />

        <ProtectedRoute 
        exact path="/" component={Main}
        onEditAvatar={handleEditAvatarClick}
        onEditProfile={handleEditProfileClick}
        onAddPlace={handleAddPlaceClick}
        onCardClick={handleCardClick}
        onCardLike={handleCardLike}
        onCardDelete={handleCardDelete}
        cards={cards}/>
         
         <ProtectedRoute 
            exact path='/' component={Footer} />
        
          
        <Switch> 
        <Route  path="/sign-up"> 
        {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-up" />} 
         <Register onRegister={handleRegister} />
         <InfoTooltip isOpen={isSetTooltipOpen} data={toolTip} onClose={closeAllPopups}/>
        </Route>

        <Route  path="/sign-in">   
        {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
         <Login onLogin={handleLogin} />
         <InfoTooltip isOpen={isSetTooltipOpen} data={toolTip} onClose={closeAllPopups}/>
        </Route>

        
        <Route exact path="/">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-up" />}
          </Route>
        
      </Switch>
      
    </CurrentUserContext.Provider>
    </div>
    </BrowserRouter>
  );
}

export default App;
