import { Navigate, Route, Routes } from "react-router-dom";
import SearchRecipesPage from "./features/recipes/SearchRecipesPage.jsx";
import AlertList from "./features/alert/AlertList.jsx";
import BookmarksPage from "./features/bookmarks/BookmarksPage.jsx";
import HistoryPage from "./features/history/HistoryPage.jsx";
import AddRecipeForm from "./features/recipes/AddRecipeForm.jsx";
import RecipesPage from "./features/recipes/RecipesPage.jsx";
import Layout from "./components/Layout.jsx";
import SingleRecipePage from "./features/recipes/SingleRecipePage.jsx";

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/">
                    <Route index element={<SearchRecipesPage />} />

                    <Route element={<Layout />}>
                        <Route path=":recipesId" element={<RecipesPage />} />
                        <Route path="bookmarks" element={<BookmarksPage />} />
                        <Route
                            path=":recipesId/:recipeId"
                            element={<SingleRecipePage />}
                        />

                        <Route path="add-recipe" element={<AddRecipeForm />} />

                        <Route path="history" element={<HistoryPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>

            <AlertList />
        </>
    );
};

export default App;
