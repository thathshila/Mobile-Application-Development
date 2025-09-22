
import { auth, storage } from "@/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    updatePassword,
    updateEmail,
    reauthenticateWithCredential,
    EmailAuthProvider
} from "firebase/auth";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "firebase/storage";

export const register = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
}

export const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
}

export const logout = () => {
    return signOut(auth);
}

export const updateUserProfile = async (displayName: string, photoURL?: string) => {
    if (!auth.currentUser) {
        throw new Error("No authenticated user");
    }
    
    const updateData: { displayName: string; photoURL?: string } = {
        displayName: displayName
    };
    
    if (photoURL !== undefined) {
        updateData.photoURL = photoURL;
    }
    
    return updateProfile(auth.currentUser, updateData);
}

export const updateUserEmail = async (newEmail: string, currentPassword: string) => {
    if (!auth.currentUser || !auth.currentUser.email) {
        throw new Error("No authenticated user");
    }

    // Re-authenticate user before updating email
    const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
    );
    
    await reauthenticateWithCredential(auth.currentUser, credential);
    return updateEmail(auth.currentUser, newEmail);
}

export const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!auth.currentUser || !auth.currentUser.email) {
        throw new Error("No authenticated user");
    }

    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
    );
    
    await reauthenticateWithCredential(auth.currentUser, credential);
    return updatePassword(auth.currentUser, newPassword);
}

export const uploadProfilePhoto = async (imageUri: string) => {
    if (!auth.currentUser) {
        throw new Error("No authenticated user");
    }

    try {
        // Create a blob from the image URI
        const response = await fetch(imageUri);
        const blob = await response.blob();

        // Create a reference to the storage location
        const fileName = `profile_photos/${auth.currentUser.uid}_${Date.now()}.jpg`;
        const storageRef = ref(storage, fileName);

        // Delete old profile photo if exists
        if (auth.currentUser.photoURL) {
            await deleteProfilePhoto();
        }

        // Upload the image
        const snapshot = await uploadBytes(storageRef, blob);
        
        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Update user profile with new photo URL
        await updateProfile(auth.currentUser, {
            photoURL: downloadURL
        });

        return downloadURL;
    } catch (error) {
        console.error("Error uploading profile photo:", error);
        throw new Error("Failed to upload profile photo");
    }
}

export const deleteProfilePhoto = async () => {
    if (!auth.currentUser || !auth.currentUser.photoURL) {
        throw new Error("No authenticated user or profile photo");
    }

    try {
        // Extract the file path from the URL
        const photoURL = auth.currentUser.photoURL;
        
        // Only delete if it's a Firebase Storage URL
        if (photoURL.includes('firebase') && photoURL.includes('profile_photos')) {
            // Create a reference from the URL
            const photoRef = ref(storage, photoURL);
            
            // Delete the file
            await deleteObject(photoRef);
        }

        // Update user profile to remove photo URL
        await updateProfile(auth.currentUser, {
            photoURL: null
        });
    } catch (error) {
        console.error("Error deleting profile photo:", error);
        // Don't throw error if file doesn't exist or can't be deleted
        // Still update the profile to remove the URL
        await updateProfile(auth.currentUser, {
            photoURL: null
        });
    }
}

export const getCurrentUser = () => {
    return auth.currentUser;
}