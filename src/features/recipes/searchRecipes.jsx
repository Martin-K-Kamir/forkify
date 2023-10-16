const SearchRecipes = () => {
    return (
        <div className="flex flex-direction-column align-items-center">
            <h1 className="block f-family-secondary f-size-fluid-6 f-weight-medium">
                Forkify
            </h1>

            <form className="form">
                <div className="[ search-input ] [ flow flex align-items-center justify-content-between radius-pill line-height-1 ]">
                    <input
                        type="text"
                        className="input"
                        placeholder="Search over 1,000,000 recipes"
                    />
                    <button>Search</button>
                </div>
            </form>
        </div>
    );
};

export default SearchRecipes;
