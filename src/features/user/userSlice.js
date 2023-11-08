import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const userRecipesAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const userRecipes = localStorage.getItem("userRecipes");

const initialState = {
    userRecipes: userRecipes ? JSON.parse(userRecipes) : userRecipesAdapter.getInitialState(),
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUserRecipe: (state, action) => {
            userRecipesAdapter.addOne(state.userRecipes, action.payload);
        },
        removeUserRecipe: (state, action) => {
            userRecipesAdapter.removeOne(state.userRecipes, action.payload);
        },
    },
});

export const {addUserRecipe, removeUserRecipe} = userSlice.actions;
export default userSlice.reducer;

export const {
    selectAll: selectAllUserRecipes,
    selectById: selectUserRecipeById,
    selectIds: selectUserRecipeIds,
    selectTotal: selectTotalUserRecipes,
} = userRecipesAdapter.getSelectors(state => state.user.userRecipes);
