import { Suspense } from "react";

import SearchResult from "./SearchResult";
import Loader from "@/components/Loader";

const SearchPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <SearchResult />
    </Suspense>
  );
};

export default SearchPage;
