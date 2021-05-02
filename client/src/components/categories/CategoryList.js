import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import CategoryRecipe from "./CategoryRecipe";
import CategoryContext from "../context/CategoryContext";

//this is the listing of categories, outside the category

//categories array from data contains a property categories which is some of
// our documents (belongs to specific user) in our collection
//from mongo
const CategoryList = ({ categories, setCategories, getCategories }) => {
  //for conditional rendering
  const { setActive, setTitle, setCategoryId } = useContext(CategoryContext);
  let selectedRecipe;

  async function saveToCategory(id) {
    console.clear();
    if (localStorage.getItem("selectedRecipe") != null) {
      selectedRecipe = JSON.parse(localStorage.getItem("selectedRecipe"));
    }

    const cachedRecipeData = {
      title: selectedRecipe.recipe.label,
      category_id: id,
      ingredients: selectedRecipe.recipe.ingredientLines,
    };

    await axios.post(
      `http://localhost:8080/category/${id}/recipe`,
      cachedRecipeData
    );
    console.log(cachedRecipeData);
  }
  async function deleteCategory(id) {
    await axios.delete(`http://localhost:8080/category/${id}`);
    //so our state updates appropiately, setting this state will cause
    //a state change in other component category's useeffect

    //the arrow function lets us avoid waiting until next rerender for
    //state to change, since state is asynchronous we have to use past
    //state to update without waiting for next rerender
    setCategories(categories.filter((category) => category._id !== id));
  }

  function renderCategories() {
    //key is just unique key...i is index...it will be incremented
    console.log(categories);
    return categories.map((category, i) => {
      return (
        <>
          <li key={i}>{category.title}</li>

          <button
            className="view-button"
            onClick={() => {
              setCategoryId(category._id);
              setTitle(category.title);
              setActive("other");
            }}
          >
            View
          </button>
          <button
            onClick={() => {
              saveToCategory(category._id);
            }}
          >
            Save Recipe
          </button>
          <button
            onClick={() => {
              deleteCategory(category._id);
            }}
          >
            Delete Category
          </button>
        </>
      );
    });
  }
  return (
    <div>
      <ul>{renderCategories()}</ul>
    </div>
  );
};

export default CategoryList;
