import React, { useState } from "react";

const useFavoriteContact = () => {
  var favoriteContact = localStorage.getItem("favoriteContact");

  if (favoriteContact === null) {
    localStorage.setItem("favoriteContact", JSON.stringify([]));
    favoriteContact = localStorage.getItem("favoriteContact");
  }

  const favoriteContactObj = JSON.parse(favoriteContact as string);
  
  function handleAddFavorite(_id?: string) {
    if (!favoriteContactObj.includes(_id)) {
      favoriteContactObj.push(_id);
      localStorage.setItem(
        "favoriteContact",
        JSON.stringify(favoriteContactObj)
      );
    }
  }
  function handleRemoveFavorite(_id?: string) {
    if (favoriteContactObj.includes(_id)) {
      const index = favoriteContactObj.indexOf(_id);
      favoriteContactObj.splice(index, 1);
      localStorage.setItem(
        "favoriteContact",
        JSON.stringify(favoriteContactObj)
      );
    }
  }
  function isFavorite(_id?: string): boolean {
    if (favoriteContactObj.includes(_id)) {
      return true;
    }
    return false;
  }

  function listContacts() {
    return favoriteContactObj;
  }

  return { handleAddFavorite, handleRemoveFavorite, isFavorite, listContacts };
};

export default useFavoriteContact;
