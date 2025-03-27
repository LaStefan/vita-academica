import  { useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import React, { useState } from "react";


const AuthTestComponent: React.FC = () => {
  const [email, setEmail] = useState("123");
  const [password, setPassword] = useState("");

  const createTestUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Test User Created: ", userCredential.user);
    } catch (error) {
      console.error("Error creating test user: ", error);
    }
  };

  const signInTestUser = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Test User Signed In: ", userCredential.user);
    } catch (error) {
      console.error("Error signing in test user: ", error);
    }
  };

  return (
    <div>
      <h2>Test Authentication</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTestUser();
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Create Test User</button>
      </form>
      <button onClick={signInTestUser}>Sign In</button>
    </div>
  );
};

export default AuthTestComponent;

const TestFirestore = () => {
  useEffect(() => {
    // const addTestData = async () => {
    //   try {
    //     const docRef = await addDoc(collection(db, "testCollection"), {
    //       name: "Test User",
    //       email: "test@example.com",
    //       createdAt: new Date(),
    //     });
    //     console.log("Test document added with ID: ", docRef.id);
    //   } catch (error) {
    //     console.error("Error adding document: ", error);
    //   }
    // };

    // addTestData();

    createTestUser('stefan@gmail.com', '123')
    signInTestUser('stefan123@gmail.com', '1234')
  }, []);
};


// export default TestFirestore;
const createTestUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Test User Created: ', userCredential.user);
  } catch (error) {
    console.error('Error creating test user: ', error);
  }
};

const signInTestUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Test User Signed In: ', userCredential.user);
  } catch (error) {
    console.error('Error signing in test user: ', error);
  }
};