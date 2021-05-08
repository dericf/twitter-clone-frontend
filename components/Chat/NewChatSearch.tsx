// React
import React, { FunctionComponent, useState } from "react";

// Hooks
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";

// CRUD
import { searchUserByUsername } from "../../crud/users";

// Schema
import { User } from "../../schema/User";

import { getConversationUsername } from "./utils";

// React-Select
import AsyncSelect from "react-select/async";
import {
  OptionsType,
  InputActionMeta,
  OptionTypeBase,
  GroupTypeBase,
} from "react-select";

interface SelectOptions {
  value: User;
  label: string;
}

interface Props {}
export const NewChatSearch: FunctionComponent<Props> = (props) => {
  // Hooks
  const { selectedUser, setSelectedUser } = useChat();
  const { user } = useAuth();

  /* Local State
    type SearchOptions = Array<{
     value: string;
    label: string;
  }>; */
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchText, setSearchText] = useState("");

  // const searchOptions: searchOptions[] = [{ value: null, label: "User 1" }];
  // Methods

  const loadOptions = (
    text: string,
    callback: (options: ReadonlyArray<SelectOptions>) => void,
  ): Promise<ReadonlyArray<SelectOptions>> | void => {
    // Clear the selected user
    setSelectedUser(null);
    // Update state
    setSearchText(text);
    if (text.length < 2) {
      setSearchOptions([]);
      callback([]);
    } else {
      (async () => {
        try {
          const { value: userResults, error } = await searchUserByUsername(
            text,
          );
          if (error) throw new Error(error.errorMessageUI);
          // console.log("Users....", userResults);

          callback(
            userResults
              .filter((usr) => usr.id !== user.id)
              .map((usr) => ({
                value: usr,
                label: usr.username,
                options: null,
              })),
          );
        } catch (error) {
          // console.log("error searching for users :>> ", error);
          callback([]);
        }
      })().catch((err) => {
        // console.error(err);
      });
    }
  };

  const selectUser = async (user: User) => {
    setSelectedUser(user);
    setSearchText(`@${user.username}`);
    setSearchOptions([]);
  };

  return (
    <div className="flex flex-col  justify-start">
      <div className="flex flex-col bg-white text-black shadow-lg justify-evenly items-stretch max-w-xl flex-shrink-0 my-4 mb-16">
        <AsyncSelect
          placeholder="Search by username"
          isClearable
          value={{
            value: selectedUser,
            label: selectedUser ? `@${selectedUser.username}` : "",
          }}
          onChange={(value, action) => {
            setSelectedUser({ ...value?.value } as User);
          }}
          loadOptions={loadOptions}
          defaultOptions={false}
        />
      </div>
    </div>
  );
};
