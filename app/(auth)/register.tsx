
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { register } from "@/service/authService";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const Register = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  
  // Error states
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const clearError = (field: string) => {
    switch (field) {
      case 'firstName':
        setFirstNameError("");
        break;
      case 'lastName':
        setLastNameError("");
        break;
      case 'email':
        setEmailError("");
        break;
      case 'password':
        setPasswordError("");
        break;
      case 'confirmPassword':
        setConfirmPasswordError("");
        break;
    }
  };

  const handleRegister = async () => {
    if (isLoading) return;

    // Reset all errors
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let hasErrors = false;

    // Validation
    if (!firstName.trim()) {
      setFirstNameError("First name is required");
      hasErrors = true;
    } else if (firstName.trim().length < 2) {
      setFirstNameError("First name must be at least 2 characters");
      hasErrors = true;
    }

    if (!lastName.trim()) {
      setLastNameError("Last name is required");
      hasErrors = true;
    } else if (lastName.trim().length < 2) {
      setLastNameError("Last name must be at least 2 characters");
      hasErrors = true;
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      hasErrors = true;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasErrors = true;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      hasErrors = true;
    } else if (!validatePassword(password)) {
      setPasswordError("Password must be 8+ characters with uppercase, lowercase, and number");
      hasErrors = true;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Please confirm your password");
      hasErrors = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasErrors = true;
    }

    if (!acceptTerms) {
      Alert.alert("Terms Required", "Please accept the Terms of Service and Privacy Policy to continue.");
      return;
    }

    if (hasErrors) return;

    setIsLoading(true);

    try {
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password: password
      };

      await register(userData.email, userData.password);
      
      Alert.alert(
        "Registration Successful",
        "Your account has been created successfully. You can now sign in.",
        [
          {
            text: "OK",
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Registration Failed", 
        "An account with this email may already exist, or there was a server error. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#7C3AED' }}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            {/* Header Section */}
            <View style={{
              height: height * 0.32,
              backgroundColor: '#7C3AED',
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Back Button */}
              <TouchableOpacity
                onPress={() => router.back()}
                style={{
                  position: 'absolute',
                  top: 50,
                  left: 20,
                  width: 40,
                  height: 40,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 10
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={20} color="white" />
              </TouchableOpacity>

              {/* Background Decorations - Book themed */}
              <View style={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 120,
                height: 120,
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: 60,
                transform: [{ rotate: '45deg' }]
              }} />
              <View style={{
                position: 'absolute',
                top: 70,
                left: -40,
                width: 80,
                height: 80,
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: 8,
                transform: [{ rotate: '15deg' }]
              }} />
              <View style={{
                position: 'absolute',
                bottom: 20,
                right: 30,
                width: 60,
                height: 60,
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderRadius: 6,
                transform: [{ rotate: '-20deg' }]
              }} />
              
              {/* Content */}
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 20
              }}>
                {/* App Logo */}
                <View style={{
                  width: 70,
                  height: 70,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.2)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3
                }}>
                  <Ionicons name="library" size={32} color="white" />
                </View>
                
                <Text style={{
                  fontSize: 28,
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: 8,
                  textAlign: 'center',
                  letterSpacing: 0.5
                }}>
                  Join StoryShelf
                </Text>
                <Text style={{
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.9)',
                  textAlign: 'center',
                  paddingHorizontal: 30,
                  fontWeight: '300'
                }}>
                  Discover, review, and share great books
                </Text>
              </View>
            </View>

            {/* Registration Form Card */}
            <View style={{
              flex: 1,
              marginTop: -30,
              backgroundColor: 'white',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingHorizontal: 24,
              paddingTop: 32,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -5 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 10
            }}>
              <Text style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: '#2D1810',
                marginBottom: 8,
                textAlign: 'center'
              }}>
                Create Your Reader Profile
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#7C3AED',
                marginBottom: 28,
                textAlign: 'center'
              }}>
                Start building your personal library
              </Text>

              {/* Name Fields Row */}
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                marginBottom: 16 
              }}>
                {/* First Name */}
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#2D1810',
                    marginBottom: 8,
                    marginLeft: 4
                  }}>
                    First Name
                  </Text>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: firstNameError ? '#FEF2F2' : '#F8FAFF',
                    borderWidth: 1.5,
                    borderColor: firstNameError ? '#F87171' : '#D1D5F0',
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 14,
                    minHeight: 48
                  }}>
                    <Ionicons 
                      name="person-outline" 
                      size={18} 
                      color={firstNameError ? "#EF4444" : "#7C3AED"} 
                    />
                    <TextInput
                      style={{
                        flex: 1,
                        marginLeft: 10,
                        fontSize: 15,
                        color: '#2D1810'
                      }}
                      placeholder="First name"
                      placeholderTextColor="#A0937D"
                      value={firstName}
                      onChangeText={(text) => {
                        setFirstName(text);
                        clearError('firstName');
                      }}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                  {firstNameError ? (
                    <Text style={{
                      color: '#DC2626',
                      fontSize: 11,
                      marginTop: 4,
                      marginLeft: 4
                    }}>
                      {firstNameError}
                    </Text>
                  ) : null}
                </View>

                {/* Last Name */}
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#2D1810',
                    marginBottom: 8,
                    marginLeft: 4
                  }}>
                    Last Name
                  </Text>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: lastNameError ? '#FEF2F2' : '#F5F0FF',
                    borderWidth: 1.5,
                    borderColor: lastNameError ? '#F87171' : '#D9C7FF',
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 14,
                    minHeight: 48
                  }}>
                    <TextInput
                      style={{
                        flex: 1,
                        fontSize: 15,
                        color: '#2D1810'
                      }}
                      placeholder="Last name"
                      placeholderTextColor="#A0937D"
                      value={lastName}
                      onChangeText={(text) => {
                        setLastName(text);
                        clearError('lastName');
                      }}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                  {lastNameError ? (
                    <Text style={{
                      color: '#DC2626',
                      fontSize: 11,
                      marginTop: 4,
                      marginLeft: 4
                    }}>
                      {lastNameError}
                    </Text>
                  ) : null}
                </View>
              </View>

              {/* Email Input */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#2D1810',
                  marginBottom: 8,
                  marginLeft: 4
                }}>
                  Email Address
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: emailError ? '#FEF2F2' : '#F5F0FF',
                  borderWidth: 1.5,
                  borderColor: emailError ? '#F87171' : '#D9C7FF',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  minHeight: 52
                }}>
                  <Ionicons 
                    name="mail-outline" 
                    size={20} 
                    color={emailError ? "#DC2626" : "#7C3AED"} 
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      fontSize: 16,
                      color: '#2D1810'
                    }}
                    placeholder="Enter your email"
                    placeholderTextColor="#A0937D"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      clearError('email');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                  />
                </View>
                {emailError ? (
                  <Text style={{
                    color: '#DC2626',
                    fontSize: 12,
                    marginTop: 4,
                    marginLeft: 4
                  }}>
                    {emailError}
                  </Text>
                ) : null}
              </View>

              {/* Password Input */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#2D1810',
                  marginBottom: 8,
                  marginLeft: 4
                }}>
                  Password
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: passwordError ? '#FEF2F2' : '#F5F0FF',
                  borderWidth: 1.5,
                  borderColor: passwordError ? '#F87171' : '#D9C7FF',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  minHeight: 52
                }}>
                  <Ionicons 
                    name="key-outline" 
                    size={20} 
                    color={passwordError ? "#DC2626" : "#7C3AED"} 
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      fontSize: 16,
                      color: '#2D1810'
                    }}
                    placeholder="Create a secure password"
                    placeholderTextColor="#A0937D"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      clearError('password');
                    }}
                    autoComplete="password-new"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ marginLeft: 8 }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#7C3AED" 
                    />
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <Text style={{
                    color: '#DC2626',
                    fontSize: 12,
                    marginTop: 4,
                    marginLeft: 4
                  }}>
                    {passwordError}
                  </Text>
                ) : null}
              </View>

              {/* Confirm Password Input */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#2D1810',
                  marginBottom: 8,
                  marginLeft: 4
                }}>
                  Confirm Password
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: confirmPasswordError ? '#FEF2F2' : '#F5F0FF',
                  borderWidth: 1.5,
                  borderColor: confirmPasswordError ? '#F87171' : '#D9C7FF',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  minHeight: 52
                }}>
                  <Ionicons 
                    name="checkmark-circle-outline" 
                    size={20} 
                    color={confirmPasswordError ? "#DC2626" : "#7C3AED"} 
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      fontSize: 16,
                      color: '#2D1810'
                    }}
                    placeholder="Confirm your password"
                    placeholderTextColor="#A0937D"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      clearError('confirmPassword');
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ marginLeft: 8 }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons 
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#7C3AED" 
                    />
                  </TouchableOpacity>
                </View>
                {confirmPasswordError ? (
                  <Text style={{
                    color: '#DC2626',
                    fontSize: 12,
                    marginTop: 4,
                    marginLeft: 4
                  }}>
                    {confirmPasswordError}
                  </Text>
                ) : null}
              </View>

              {/* Terms and Conditions */}
              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginBottom: 24
                }}
                onPress={() => setAcceptTerms(!acceptTerms)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  borderWidth: 2,
                  borderColor: acceptTerms ? '#7C3AED' : '#D1D5DB',
                  backgroundColor: acceptTerms ? '#7C3AED' : 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 2
                }}>
                  {acceptTerms && (
                    <Ionicons name="checkmark" size={12} color="white" />
                  )}
                </View>
                <Text style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 13,
                  color: '#6B7280',
                  lineHeight: 18
                }}>
                  I agree to the{" "}
                  <Text style={{ color: '#7C3AED', fontWeight: '600' }}>
                    Terms of Service
                  </Text>
                  {" "}and{" "}
                  <Text style={{ color: '#7C3AED', fontWeight: '600' }}>
                    Privacy Policy
                  </Text>
                </Text>
              </Pressable>

              {/* Register Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: isLoading ? '#D1D5DB' : '#7C3AED',
                  paddingVertical: 16,
                  borderRadius: 12,
                  shadowColor: '#7C3AED',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isLoading ? 0 : 0.25,
                  shadowRadius: 8,
                  elevation: isLoading ? 0 : 6,
                  marginBottom: 20
                }}
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: '600',
                  letterSpacing: 0.5
                }}>
                  {isLoading ? "Creating Your Profile..." : "Start Reading Journey"}
                </Text>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ color: '#6B7280', fontSize: 14 }}>
                  Already a reader?{" "}
                  <Pressable 
                    onPress={() => router.back()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={{
                      fontWeight: '600',
                      color: '#7C3AED',
                      textDecorationLine: 'underline'
                    }}>
                      Sign In
                    </Text>
                  </Pressable>
                </Text>
              </View>

              {/* Security Badge */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: 20
              }}>
                <Ionicons name="book" size={14} color="#7C3AED" />
                <Text style={{
                  marginLeft: 6,
                  color: '#7C3AED',
                  fontSize: 11,
                  fontWeight: '500'
                }}>
                  Your reading data is private and secure
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;