// React
import { FunctionComponent, useState } from "react";

// Hooks
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";

// CRUD
import { searchUserByUsername } from "../../crud/users";

// Schema
import { User } from "../../schema/User";

interface Props {}
export const NewChatSearch: FunctionComponent<Props> = (props) => {
  // Hooks
  const { selectedUser, setSelectedUser } = useChat();
  const { user } = useAuth();

  // Local State
  const [searchResults, setSearchResults] = useState<Array<User>>([]);
  const [searchText, setSearchText] = useState("");

  // Methods
  const handleChange = async (e) => {
    // Clear the selected user
    setSelectedUser(null);
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

  const selectUser = async (user: User) => {
    setSelectedUser(user);
    setSearchText(`@${user.username}`);
    setSearchResults([]);
  };

  return (
    <div className="flex flex-col  justify-start">
      <div className="flex flex-col bg-white text-black shadow-lg justify-evenly items-stretch max-w-xl flex-shrink-0 my-4 mb-16">
        <input
          autoFocus={true}
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
          {!selectedUser && searchText.length >= 2 && (
            <h3 className="text-lg text-center px-2 py-1 bg-trueGray-700 text-white">
              Results:
            </h3>
          )}
          {!selectedUser &&
            searchResults?.length === 0 &&
            searchText.length >= 2 && (
              <div className="px-4 py-2 flex justify-center">No Results</div>
            )}
          {searchResults &&
            searchResults.map((resultUser) => {
              if (resultUser.id === user.id) return;
              return (
                <div
                  key={resultUser.id}
                  onClick={async () => {
                    await selectUser(resultUser);
                  }}
                  className="px-4 py-4 flex justify-center cursor-pointer hover:bg-trueGray-300 hover:text-lightBlue-700 border-t-2 uppercase"
                >
                  @{resultUser.username}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
