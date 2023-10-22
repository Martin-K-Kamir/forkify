import { Route, Routes } from "react-router-dom";
import SearchRecipesPage from "./features/recipes/SearchRecipesPage.jsx";
import AlertList from "./features/alert/AlertList.jsx";
import FavoritesPage from "./features/favorites/FavoritesPage.jsx";
import HistoryPage from "./features/history/HistoryPage.jsx";
import AddRecipeForm from "./features/recipes/AddRecipeForm.jsx";
import RecipesPage from "./features/recipes/RecipesPage.jsx";
import Layout from "./components/Layout.jsx";

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/">
                    <Route index element={<SearchRecipesPage />} />

                    <Route element={<Layout />}>
                        <Route path="recipes">
                            <Route
                                path=":recipesId"
                                element={<RecipesPage />}
                            />
                        </Route>

                        <Route path="add-recipe" element={<AddRecipeForm />} />

                        <Route path="favorites" element={<FavoritesPage />} />

                        <Route path="history" element={<HistoryPage />} />
                    </Route>
                </Route>
            </Routes>

            <AlertList />
        </>
    );
};

export default App;
