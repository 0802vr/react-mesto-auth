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
  const [loggedIn, setLoggedIn] = React.useState(false);
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
   
  

   

   
 

  


  return (
    <BrowserRouter>
    <body className="page">
    <CurrentUserContext.Provider value={currentUser}>
      
        <Header />
 

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onUpdateCard={handleUpdateCard}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarisPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <ImagePopup
          name={selectedCard.name}
          link={selectedCard.link}
          onClose={closeAllPopups}
        />
        
        <Route path="/sign-up">
          <Register
          />
        </Route>

          <Route path="/sign-in">
          <Login />
        </Route>

        <Switch>
       
          <ProtectedRoute
            exact path="/" component={Main} 
            loggedIn={loggedIn}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            
          >
            <Main></Main>
            <Footer />
          </ProtectedRoute>
        </Switch>
      
    </CurrentUserContext.Provider>
    </body>
    </BrowserRouter>
  );
}

export default App;
