
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
import { login } from "@/service/authService";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError("");
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError("");
  };

  const handleLogin = async () => {
    if (isLoading) return;

    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Validation
    let hasErrors = false;
    
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
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsLoading(true);
    await login(email, password)
      .then((res) => {
        router.push("/foryou");
      })
      .catch(() => {
        Alert.alert(
          "Login Failed",
          "Invalid credentials. Please check your email and password and try again."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#7c3aed' }}>
      <StatusBar barStyle="light-content" backgroundColor="#7c3aed" />
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
          <View style={{ flex: 1, backgroundColor: '#fefbff' }}>
            {/* Header Section with Literary Theme */}
            <View style={{
              height: height * 0.4,
              backgroundColor: '#7c3aed',
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Background Decorations - Book Pages */}
              <View style={{
                position: 'absolute',
                top: -30,
                right: -40,
                width: 120,
                height: 160,
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: 8,
                transform: [{ rotate: '15deg' }]
              }} />
              <View style={{
                position: 'absolute',
                top: 60,
                left: -20,
                width: 80,
                height: 100,
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: 6,
                transform: [{ rotate: '-20deg' }]
              }} />
              <View style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                width: 60,
                height: 80,
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderRadius: 4,
                transform: [{ rotate: '25deg' }]
              }} />
              
              {/* Content */}
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 40
              }}>
                {/* App Logo - Book Stack */}
                <View style={{
                  width: 85,
                  height: 85,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 22,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 20,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.25)',
                  position: 'relative'
                }}>
                  {/* Book stack effect */}
                  <View style={{
                    position: 'absolute',
                    width: 75,
                    height: 75,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 18,
                    top: 2,
                    left: 2
                  }} />
                  <Ionicons name="library" size={38} color="white" />
                </View>
                
                <Text style={{
                  fontSize: 34,
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: 8,
                  textAlign: 'center',
                  letterSpacing: -0.5
                }}>
                  StoryShelf
                </Text>
                <Text style={{
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.9)',
                  textAlign: 'center',
                  paddingHorizontal: 20,
                  fontStyle: 'italic'
                }}>
                  Where every book finds its story
                </Text>
              </View>
            </View>

            {/* Login Form Card */}
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
                fontSize: 24,
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: 8,
                textAlign: 'center'
              }}>
                Welcome Back, Reader
              </Text>
              <Text style={{
                fontSize: 16,
                color: '#6b7280',
                marginBottom: 32,
                textAlign: 'center'
              }}>
                Continue your literary journey
              </Text>

              {/* Email Input */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: 8,
                  marginLeft: 4
                }}>
                  Email Address
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: emailError ? '#fef2f2' : '#faf9ff',
                  borderWidth: 1,
                  borderColor: emailError ? '#fca5a5' : '#e0e7ff',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  minHeight: 52
                }}>
                  <Ionicons 
                    name="mail-outline" 
                    size={20} 
                    color={emailError ? "#ef4444" : "#7c3aed"} 
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      fontSize: 16,
                      color: '#1f2937'
                    }}
                    placeholder="Enter your email"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                  />
                </View>
                {emailError ? (
                  <Text style={{
                    color: '#ef4444',
                    fontSize: 12,
                    marginTop: 4,
                    marginLeft: 4
                  }}>
                    {emailError}
                  </Text>
                ) : null}
              </View>

              {/* Password Input */}
              <View style={{ marginBottom: 24 }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8
                }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#374151',
                    marginLeft: 4
                  }}>
                    Password
                  </Text>
                  <Pressable 
                    onPress={() => router.push("/forgotPassword")}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={{
                      color: '#7c3aed',
                      fontSize: 12,
                      fontWeight: '600'
                    }}>
                      Forgot Password?
                    </Text>
                  </Pressable>
                </View>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: passwordError ? '#fef2f2' : '#faf9ff',
                  borderWidth: 1,
                  borderColor: passwordError ? '#fca5a5' : '#e0e7ff',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  minHeight: 52
                }}>
                  <Ionicons 
                    name="lock-closed-outline" 
                    size={20} 
                    color={passwordError ? "#ef4444" : "#7c3aed"} 
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      fontSize: 16,
                      color: '#1f2937'
                    }}
                    placeholder="Enter your password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={handlePasswordChange}
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ marginLeft: 8 }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#7c3aed" 
                    />
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <Text style={{
                    color: '#ef4444',
                    fontSize: 12,
                    marginTop: 4,
                    marginLeft: 4
                  }}>
                    {passwordError}
                  </Text>
                ) : null}
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: isLoading ? '#d1d5db' : '#7c3aed',
                  paddingVertical: 16,
                  borderRadius: 12,
                  shadowColor: '#7c3aed',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isLoading ? 0 : 0.3,
                  shadowRadius: 8,
                  elevation: isLoading ? 0 : 6
                }}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: '600'
                }}>
                  {isLoading ? "Opening your library..." : "Enter Library"}
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 24
              }}>
                <View style={{ flex: 1, height: 1, backgroundColor: '#e0e7ff' }} />
                <Text style={{
                  marginHorizontal: 16,
                  color: '#7c3aed',
                  fontSize: 14,
                  fontWeight: '500'
                }}>
                  or
                </Text>
                <View style={{ flex: 1, height: 1, backgroundColor: '#e0e7ff' }} />
              </View>

              {/* Quick Access */}
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: '#e0e7ff',
                  borderRadius: 12,
                  marginBottom: 32,
                  backgroundColor: '#faf9ff'
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="book-outline" size={20} color="#7c3aed" />
                <Text style={{
                  marginLeft: 8,
                  color: '#374151',
                  fontSize: 14,
                  fontWeight: '500'
                }}>
                  Quick Library Access
                </Text>
              </TouchableOpacity>

              {/* Register Link */}
              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ color: '#6b7280', fontSize: 14 }}>
                  New to StoryShelf?{" "}
                  <Pressable 
                    onPress={() => router.push("/register")}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={{
                      fontWeight: '600',
                      color: '#7c3aed',
                      textDecorationLine: 'underline'
                    }}>
                      Start Reading
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
                <Ionicons name="shield-checkmark" size={14} color="#7c3aed" />
                <Text style={{
                  marginLeft: 6,
                  color: '#6b7280',
                  fontSize: 11
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

export default Login;