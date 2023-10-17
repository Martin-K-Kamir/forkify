import { Route, Routes } from "react-router-dom";
import SearchRecipes from "./features/recipes/SearchRecipes.jsx";
import RecipesList from "./features/recipes/RecipesList.jsx";

const App = () => {
    return (
        <div className="wrapper">
            <Routes>
                <Route path="/">
                    <Route index element={<SearchRecipes />} />

                    <Route path="recipes">
                        <Route path=":recipesId" element={<RecipesList />} />
                    </Route>

                </Route>
            </Routes>
        </div>
    );
};

export default App;
