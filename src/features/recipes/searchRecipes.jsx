const SearchRecipes = () => {
    const recipes = [
        "Pizza",
        "Salad",
        "Tacos",
        "Cake",
        "Seafood",
        "Kebab",
        "Hamburger",
        "Pineapple",
        "Sausage",
    ];

    const renderedRecipes = recipes.map(recipe => {
        return (
            <button
                className="bg-zinc-800 text-zinc-100 text-alpha-700 px-m py-xs f-size--1 line-height-1 radius-pill"
                key={recipe}
            >
                {recipe}
            </button>
        );
    });

    return (
        <div className="h-screen flex flex-direction-column align-items-center gap-xl pt-fluid-2xl-7xl">
            <h1 className="block f-family-secondary f-size-6 f-weight-medium line-height-1">
                Forkify
            </h1>

            <form className="form flex max-w-l gap-m w-full flex-direction-column//below-md">
                <input
                    type="text"
                    className="input bg-zinc-800 p-s radius-1 w-full"
                    placeholder="Search over 1,000,000 recipes"
                />
                <button className="button radius-1">Search</button>
            </form>

            <div className="max-w-m flex flex-wrap justify-content-center gap-s">
                {renderedRecipes}
            </div>
        </div>
    );
};

export default SearchRecipes;
