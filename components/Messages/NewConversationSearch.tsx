import { useRouter } from "next/router";
import { useState } from "react";
import { searchUserByUsername } from "../../crud/users";
import { useAuth } from "../../hooks/useAuth";
import { User } from "../../schema/User";

export const NewConversationSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Array<User>>([]);

  const { user } = useAuth();

  const router = useRouter();

  const handleChange = async (e) => {
    const text: string = e.currentTarget.value;
    setSearchText(text);
    if (text.length < 2) {
      setSearchResults([]);
    }
    if (text.length >= 2)
      try {
        const { value, error } = await searchUserByUsername(text);
        if (error) throw new Error(error.errorMessageUI);
        setSearchResults(value.filter((usr) => usr.id !== user.id));
      } catch (error) {
        console.log("error searching for users :>> ", error);
      }
  };

  const selectUser = (userId) => {
    console.log("selected user: ", userId);
    router.push(`/messages/${userId}`);
  };

  return (
    <div className="flex flex-col bg-white text-black shadow-lg justify-evenly items-stretch max-w-xl flex-shrink-0 my-4 mb-16">
      <input
        type="text"
        className="text-black"
        name="userSearch"
        placeholder="search for a user..."
        autoComplete="off"
        value={searchText}
        onChange={handleChange}
      />
      <div className="flex flex-col flex-1 max-h-60 flex-shrink-0 flex-grow">
        {/* {JSON.stringify(searchResults)} */}
        {searchText.length >= 2 && (
          <h3 className="text-lg text-center px-2 py-2 bg-trueGray-700 text-white">
            Results:
          </h3>
        )}
        {searchResults?.length === 0 && searchText.length >= 2 && (
          <div className="px-4 py-2 flex justify-center">No Results</div>
        )}
        {searchResults &&
          searchResults.map((resultUser) => {
            if (resultUser.id === user.id) return;
            return (
              <div
                key={resultUser.id}
                onClick={() => {
                  selectUser(resultUser.id);
                }}
                className="px-4 py-2 flex justify-center cursor-pointer hover:bg-trueGray-100 hover:text-lightBlue-700 border-t-2"
              >
                {resultUser.username}
              </div>
            );
          })}
      </div>
    </div>
  );
};
