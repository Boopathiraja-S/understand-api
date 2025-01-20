import { EditableText } from '@blueprintjs/core';   // npm i @blueprintjs/core to get this type of EditableText it is also like tailwind framework
import React, { useEffect, useState } from 'react'
const App = () => {

  const [users, setUsers] = useState([]) // to update the user states or api data
  const [newName, setNewName] = useState("")  // to get new user name
  const [newEmail, setNewEmail] = useState("") // to get new user email
  const [newWebsite, setNewWebsite] = useState("") // to get new user website

  useEffect(() => {

    /**
    By using this useEffect we get the data update one by one 
    and in the dataFetch function we get the data from the api and fetch this async method
    and update the data into the users by useing setUsers
     */

    async function dataFectch() {

      try {
        const usersData = await fetch("http://localhost:5000/data");
        const response = await usersData.json()
        setUsers(response)
        console.log(response);
      }
      catch (error) {
        console.error("The error is :\n", error);
      }
    }
    dataFectch()
  }, [])

  async function addUsers() {

    /**
  
    1. This function is used for to add the newUsers into the data.
    2. maxId and id is for to update the id in number or numeric method if we did not use this 
    it creates its one primary id which is not for usefull for this table.
    3. if we fetch any api it always or defaultly a GET method so in here we need to update i mean post new user into
    the data so we give the command or method as POST that help to post or push the new data into the datalist.
    4. we create the if block is only update the data if the field is filled by the user
    5. setUsers([...users, response]) this is for to update the data did not affect or leave the rest data or 
    update the new data to the rest data..

     */

    try {
      // const maxId = users.length > 0 ? Math.max(...users.map(user => Number(user.id))) : 1; // Start from 11
      // const id = maxId + 1;
      const name = newName.trim()
      const email = newEmail.trim()
      const website = newWebsite.trim()

      if (name && email && website) {
        const newUser = await fetch("http://localhost:5000/data", {
          method: "POST",
          body: JSON.stringify({
            // id,
            name,
            email,
            website
          }),
          headers: {
            "Content-Type": "application/json; charset=UTF-8"
          }
        });
        const response = await newUser.json();
        setUsers([...users, response])
      }
      else {
        alert("please provide data broo...")
      }
      setNewName("")
      setNewEmail("")
      setNewWebsite("")
      // after submit it clear the input field
    }
    catch (error) {
      console.error("The addUser's error is :\n", error);
    }
  }

  // Handle inline edits for user fields
  function onChangeHandler(userId, key, value) {

    /*
    1. This function is used to update the user data that respected filed. 
    so that is why we use this function to update the data. 
    */

    return setUsers(users.map(user => {
      return user.id === userId ? { ...user, [key]: value } : user;
    })
    )
  }

  async function updateUser(userId) {

    /* 
    1. This function is used for update the user data that respected id so thats why we find the userId and give it to the user variable
    2. In this function we use PUT method to update the user data one by one if the user want to. 
    3. setUsers(users.map(user => user.id === userId ? response : user))  in this state it update the user data based on userId if the id matches 
    it update the response if it doesnt it leaves the data as it as so that's why we give user i mean (response : user)
    */

    const user = users.find((user) => user.id === userId)
    try {
      const updateUser = await fetch(`http://localhost:5000/data/${userId}`, {
        method: "PUT",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        }
      });
      const response = await updateUser.json();
      setUsers(users.map(user => user.id === userId ? response : user));

    } catch (error) {
      console.error(error);

    }
  }

  async function deleteUser(userId) {

    /*

    1. In this function we delete the user that respected id and also we dont need the headers and body because we did not update 
    anything here we ony delete the data so we can leave those.
    2. and update the data table without delete or unwanted data that is why we use the filter method to avoid selected id 

     */

    try {
      const DeleteUser = await fetch(`http://localhost:5000/data/${userId}`, {
        method: "DELETE",
      });
      const response = await DeleteUser.json();
      setUsers((users) => {
        return users.filter(user => userId !== user.id)
      });

    } catch (error) {
      console.error(error);
    }

  }

  return (
    <div className=' mt-1 flex items-center justify-center'>
      <div className='flex flex-col'>

        {/* header diveison */}
        <div className='flex justify-center mb-2'>
          <h1 className='text-xl font-semibold'>
            Understand API
          </h1>
        </div>

        {/* table div */}
        <div className='mb-2'>
          <table className=' border-y-2'>
            {/* table head */}
            <thead className='border border-x-2 bg-orange-400'>
              <tr>
                <th className='px-3 md:px-4 py-2'>Id</th>
                <th className='px-3 md:px-4 py-2'>Name</th>
                <th className='px-3 md:px-4 py-2'>Email</th>
                <th className='px-3 md:px-4 py-2'>Website</th>
                <th className='px-3 md:px-4 py-2'>Action</th>
              </tr>
            </thead>
            {/* table body or user data */}
            <tbody className='border bg-orange-300'>
              {
                users.map((user) => (
                  <tr className='border border-y-4' key={user.id}>
                    <td className='px-3 md:px-4 py-2'>{user.id}</td>
                    <td className='px-3 md:px-4 py-2'>{user.name}</td>
                    <td className='px-3 md:px-4 py-2'><EditableText value={user.email} onChange={value => onChangeHandler(user.id, "email", value)} /></td>
                    <td className='px-3 md:px-4 py-2'><EditableText value={user.website} onChange={value => onChangeHandler(user.id, "website", value)} /></td>
                    <td className='px-3 md:px-4 py-2'>
                      <button
                        onClick={() => updateUser(user.id)}
                        className='w-20 py-1 font-medium bg-green-500 rounded-md text-white hover:bg-green-600 transition-all hover:scale-105 md:mr-2 mb-2 md:mb-0'
                      >Update</button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className='w-20 py-1 font-medium bg-red-500 rounded-md text-white hover:bg-red-600 transition-all hover:scale-105 md:mr-2 mb-2 md:mb-0'
                      >Delete</button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
            {/* inser new users */}
            <tfoot className='border bg-orange-300'>
              <tr className='border border-y-4'>
                <td></td>
                <td className='px-2 py-2'>
                  <input
                    type="text"
                    placeholder='Enter user name'
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className='w-48 p-1 rounded-md border-none outline-none placeholder:text-sm'
                  />
                </td>
                <td className='px-2 py-2'>
                  <input
                    type="email"
                    value={newEmail}
                    placeholder='Enter user email'
                    onChange={(e) => setNewEmail(e.target.value)}
                    className='w-48 p-1 rounded-md border-none outline-none placeholder:text-sm'
                  />
                </td>
                <td className='px-2 py-2'>
                  <input
                    type="url"
                    value={newWebsite}
                    placeholder='Enter user website'
                    onChange={(e) => setNewWebsite(e.target.value)}
                    className='w-48 p-1 rounded-md border-none outline-none placeholder:text-sm'
                  />
                </td>
                <td className='px-3 md:px-4 py-2 flex justify-center'>
                  <button
                    onClick={addUsers}
                    className='px-3 py-1 bg-green-500 hover:bg-green-600 rounded-md transition-all hover:scale-105 font-medium text-white self-center'>
                    Submit</button>
                </td>
              </tr>
            </tfoot>

          </table>
        </div>
      </div>
    </div>
  )
}

export default App