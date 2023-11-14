import { Navigate, Route, Routes } from "react-router-dom";
import SearchRecipesPage from "./features/recipes/SearchRecipesPage.jsx";
import AlertList from "./features/alert/AlertList.jsx";
import UserRecipesPage from "./features/user/UserRecipesPage.jsx";
import AddRecipeForm from "./features/recipes/AddRecipeForm.jsx";
import RecipesPage from "./features/recipes/RecipesPage.jsx";
import Layout from "./components/Layout.jsx";
import SingleRecipePage from "./features/recipes/SingleRecipePage.jsx";

const App = () => {
    return (
        <>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" index element={<SearchRecipesPage />} />
                    <Route path="search/:recipesId" element={<RecipesPage />} />
                    <Route
                        path="search/:recipesId/:recipeId"
                        element={<SingleRecipePage />}
                    />
                    <Route path="my-recipes" element={<UserRecipesPage />} />
                    <Route
                        path="my-recipes/:recipeId"
                        element={<SingleRecipePage />}
                    />

                    <Route path="add-recipe" element={<AddRecipeForm />} />
                    <Route
                        path="add-recipe/:recipeId"
                        element={<SingleRecipePage />}
                    />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <AlertList />
        </>
    );
};

export default App;
