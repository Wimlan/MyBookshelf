function Input(props: { change: Function; value: string }) {
  return (
    <section className="mt-3">
      <div className="relative">
        <form className="w-full" onSubmit={(event) => event.preventDefault()}>
          <label
            htmlFor="search"
            className="block mb-2.5 text-sm font-medium text-darkest sr-only "
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-body"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="2"
                  d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              onChange={(e) => props.change(e.target.value)}
              value={props.value}
              type="search"
              id="search"
              className="block w-full p-3 ps-9 bg-lightest border border-default-medium text-darkest text-sm rounded-base focus:ring-mediumgreen focus:border-mediumgreen shadow-xs placeholder:text-body"
              placeholder="Search"
              required
            />
          </div>
        </form>
      </div>
    </section>
  );
}

export default Input;
