const SearchRecipes = () => {
    return (
        <div className="flex flex-direction-column align-items-center">
            <h1 className="block f-family-secondary f-size-fluid-6 f-weight-medium">
                Forkify
            </h1>

            <form className="form">
                <input
                    type="text"
                    className="input"
                    placeholder="Search over 1,000,000 recipes"
                />
            </form>
        </div>
    );
};

export default SearchRecipes;
