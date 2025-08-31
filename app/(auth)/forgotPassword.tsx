// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Pressable,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Dimensions,
//   StatusBar,
//   SafeAreaView,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";

// const { width, height } = Dimensions.get("window");

// const ForgotPassword = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [emailError, setEmailError] = useState<string>("");
//   const [emailSent, setEmailSent] = useState<boolean>(false);

//   const validateEmail = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const handleEmailChange = (text: string) => {
//     setEmail(text);
//     if (emailError) setEmailError("");
//   };

//   const handleResetPassword = async () => {
//     if (isLoading) return;

//     // Reset errors
//     setEmailError("");

//     // Validation
//     if (!email.trim()) {
//       setEmailError("Email is required");
//       return;
//     }

//     if (!validateEmail(email)) {
//       setEmailError("Please enter a valid email address");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Simulate API call - replace with your actual forgot password service
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // On success
//       setEmailSent(true);
      
//       // Optional: Show success alert
//       Alert.alert(
//         "Reset Link Sent",
//         "We've sent a password reset link to your email address. Please check your inbox and spam folder.",
//         [{ text: "OK" }]
//       );
//     } catch (error) {
//       Alert.alert(
//         "Error",
//         "Failed to send reset link. Please try again or contact support if the problem persists."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendEmail = () => {
//     setEmailSent(false);
//     setEmail("");
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#059669' }}>
//       <StatusBar barStyle="light-content" backgroundColor="#059669" />
//       <KeyboardAvoidingView 
//         style={{ flex: 1 }} 
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
//       >
//         <ScrollView 
//           contentContainerStyle={{ flexGrow: 1 }}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//           bounces={false}
//         >
//           <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
//             {/* Header Section */}
//             <View style={{
//               height: height * 0.35,
//               backgroundColor: '#059669',
//               borderBottomLeftRadius: 32,
//               borderBottomRightRadius: 32,
//               position: 'relative',
//               overflow: 'hidden'
//             }}>
//               {/* Back Button */}
//               <TouchableOpacity
//                 onPress={() => router.back()}
//                 style={{
//                   position: 'absolute',
//                   top: 50,
//                   left: 20,
//                   width: 40,
//                   height: 40,
//                   backgroundColor: 'rgba(255,255,255,0.2)',
//                   borderRadius: 20,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   zIndex: 10
//                 }}
//                 activeOpacity={0.7}
//               >
//                 <Ionicons name="arrow-back" size={20} color="white" />
//               </TouchableOpacity>

//               {/* Background Decorations */}
//               <View style={{
//                 position: 'absolute',
//                 top: -50,
//                 right: -50,
//                 width: 150,
//                 height: 150,
//                 backgroundColor: 'rgba(255,255,255,0.1)',
//                 borderRadius: 75
//               }} />
//               <View style={{
//                 position: 'absolute',
//                 top: 80,
//                 left: -30,
//                 width: 100,
//                 height: 100,
//                 backgroundColor: 'rgba(255,255,255,0.05)',
//                 borderRadius: 50
//               }} />
              
//               {/* Content */}
//               <View style={{
//                 flex: 1,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 paddingTop: 20
//               }}>
//                 {/* Icon */}
//                 <View style={{
//                   width: 80,
//                   height: 80,
//                   backgroundColor: 'rgba(255,255,255,0.2)',
//                   borderRadius: 20,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   marginBottom: 20,
//                   borderWidth: 1,
//                   borderColor: 'rgba(255,255,255,0.3)'
//                 }}>
//                   <Ionicons name="key-outline" size={36} color="white" />
//                 </View>
                
//                 <Text style={{
//                   fontSize: 28,
//                   fontWeight: 'bold',
//                   color: 'white',
//                   marginBottom: 8,
//                   textAlign: 'center'
//                 }}>
//                   {emailSent ? "Check Your Email" : "Forgot Password?"}
//                 </Text>
//                 <Text style={{
//                   fontSize: 16,
//                   color: 'rgba(255,255,255,0.9)',
//                   textAlign: 'center',
//                   paddingHorizontal: 30,
//                   lineHeight: 22
//                 }}>
//                   {emailSent 
//                     ? "We've sent a password reset link to your email address"
//                     : "Don't worry, we'll help you reset your password"
//                   }
//                 </Text>
//               </View>
//             </View>

//             {/* Form Card */}
//             <View style={{
//               flex: 1,
//               marginTop: -30,
//               backgroundColor: 'white',
//               borderTopLeftRadius: 30,
//               borderTopRightRadius: 30,
//               paddingHorizontal: 24,
//               paddingTop: 32,
//               shadowColor: '#000',
//               shadowOffset: { width: 0, height: -5 },
//               shadowOpacity: 0.1,
//               shadowRadius: 10,
//               elevation: 10
//             }}>
              
//               {!emailSent ? (
//                 // Email Input Form
//                 <>
//                   <Text style={{
//                     fontSize: 20,
//                     fontWeight: 'bold',
//                     color: '#1f2937',
//                     marginBottom: 8,
//                     textAlign: 'center'
//                   }}>
//                     Reset Your Password
//                   </Text>
//                   <Text style={{
//                     fontSize: 14,
//                     color: '#6b7280',
//                     marginBottom: 32,
//                     textAlign: 'center',
//                     lineHeight: 20,
//                     paddingHorizontal: 10
//                   }}>
//                     Enter your email address and we'll send you a link to reset your password
//                   </Text>

//                   {/* Email Input */}
//                   <View style={{ marginBottom: 24 }}>
//                     <Text style={{
//                       fontSize: 14,
//                       fontWeight: '600',
//                       color: '#374151',
//                       marginBottom: 8,
//                       marginLeft: 4
//                     }}>
//                       Email Address
//                     </Text>
//                     <View style={{
//                       flexDirection: 'row',
//                       alignItems: 'center',
//                       backgroundColor: emailError ? '#fef2f2' : '#f9fafb',
//                       borderWidth: 1,
//                       borderColor: emailError ? '#fca5a5' : '#e5e7eb',
//                       borderRadius: 12,
//                       paddingHorizontal: 16,
//                       paddingVertical: 16,
//                       minHeight: 52
//                     }}>
//                       <Ionicons 
//                         name="mail-outline" 
//                         size={20} 
//                         color={emailError ? "#ef4444" : "#6b7280"} 
//                       />
//                       <TextInput
//                         style={{
//                           flex: 1,
//                           marginLeft: 12,
//                           fontSize: 16,
//                           color: '#1f2937'
//                         }}
//                         placeholder="Enter your email address"
//                         placeholderTextColor="#9ca3af"
//                         value={email}
//                         onChangeText={handleEmailChange}
//                         keyboardType="email-address"
//                         autoCapitalize="none"
//                         autoComplete="email"
//                         autoCorrect={false}
//                       />
//                     </View>
//                     {emailError ? (
//                       <Text style={{
//                         color: '#ef4444',
//                         fontSize: 12,
//                         marginTop: 4,
//                         marginLeft: 4
//                       }}>
//                         {emailError}
//                       </Text>
//                     ) : null}
//                   </View>

//                   {/* Reset Password Button */}
//                   <TouchableOpacity
//                     style={{
//                       backgroundColor: isLoading ? '#d1d5db' : '#059669',
//                       paddingVertical: 16,
//                       borderRadius: 12,
//                       shadowColor: '#059669',
//                       shadowOffset: { width: 0, height: 4 },
//                       shadowOpacity: isLoading ? 0 : 0.3,
//                       shadowRadius: 8,
//                       elevation: isLoading ? 0 : 6,
//                       marginBottom: 20
//                     }}
//                     onPress={handleResetPassword}
//                     disabled={isLoading}
//                     activeOpacity={0.8}
//                   >
//                     <Text style={{
//                       color: 'white',
//                       textAlign: 'center',
//                       fontSize: 16,
//                       fontWeight: '600'
//                     }}>
//                       {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
//                     </Text>
//                   </TouchableOpacity>
//                 </>
//               ) : (
//                 // Email Sent Success State
//                 <>
//                   <View style={{ alignItems: 'center', marginBottom: 32 }}>
//                     <View style={{
//                       width: 60,
//                       height: 60,
//                       backgroundColor: '#dcfce7',
//                       borderRadius: 30,
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       marginBottom: 20
//                     }}>
//                       <Ionicons name="checkmark-circle" size={32} color="#059669" />
//                     </View>
                    
//                     <Text style={{
//                       fontSize: 20,
//                       fontWeight: 'bold',
//                       color: '#1f2937',
//                       marginBottom: 8,
//                       textAlign: 'center'
//                     }}>
//                       Email Sent Successfully
//                     </Text>
//                     <Text style={{
//                       fontSize: 14,
//                       color: '#6b7280',
//                       textAlign: 'center',
//                       lineHeight: 20,
//                       paddingHorizontal: 10
//                     }}>
//                       We've sent a password reset link to{"\n"}
//                       <Text style={{ fontWeight: '600', color: '#059669' }}>
//                         {email}
//                       </Text>
//                     </Text>
//                   </View>

//                   {/* Instructions */}
//                   <View style={{
//                     backgroundColor: '#f0fdf4',
//                     borderRadius: 12,
//                     padding: 16,
//                     marginBottom: 24,
//                     borderWidth: 1,
//                     borderColor: '#bbf7d0'
//                   }}>
//                     <Text style={{
//                       fontSize: 14,
//                       color: '#365314',
//                       fontWeight: '600',
//                       marginBottom: 8
//                     }}>
//                       What's next?
//                     </Text>
//                     <Text style={{
//                       fontSize: 13,
//                       color: '#4d7c0f',
//                       lineHeight: 18
//                     }}>
//                       1. Check your email inbox{"\n"}
//                       2. Click the reset link in the email{"\n"}
//                       3. Create a new password{"\n"}
//                       4. Sign in with your new password
//                     </Text>
//                   </View>

//                   {/* Resend Button */}
//                   <TouchableOpacity
//                     style={{
//                       backgroundColor: 'white',
//                       paddingVertical: 14,
//                       borderRadius: 12,
//                       borderWidth: 1,
//                       borderColor: '#e5e7eb',
//                       marginBottom: 20
//                     }}
//                     onPress={handleResendEmail}
//                     activeOpacity={0.7}
//                   >
//                     <Text style={{
//                       color: '#374151',
//                       textAlign: 'center',
//                       fontSize: 14,
//                       fontWeight: '500'
//                     }}>
//                       Didn't receive the email? Send again
//                     </Text>
//                   </TouchableOpacity>
//                 </>
//               )}

//               {/* Back to Login */}
//               <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
//                 <Pressable 
//                   onPress={() => router.back()}
//                   hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//                   style={{ flexDirection: 'row', alignItems: 'center' }}
//                 >
//                   <Ionicons name="arrow-back-outline" size={16} color="#059669" />
//                   <Text style={{
//                     marginLeft: 6,
//                     color: '#059669',
//                     fontSize: 14,
//                     fontWeight: '600'
//                   }}>
//                     Back to Sign In
//                   </Text>
//                 </Pressable>
//               </View>

//               {/* Support */}
//               <View style={{
//                 alignItems: 'center',
//                 paddingBottom: 20,
//                 borderTopWidth: 1,
//                 borderTopColor: '#f3f4f6',
//                 marginTop: 20,
//                 paddingTop: 20
//               }}>
//                 <Text style={{
//                   color: '#6b7280',
//                   fontSize: 12,
//                   textAlign: 'center',
//                   marginBottom: 8
//                 }}>
//                   Still having trouble?
//                 </Text>
//                 <Pressable hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
//                   <Text style={{
//                     color: '#059669',
//                     fontSize: 12,
//                     fontWeight: '600',
//                     textDecorationLine: 'underline'
//                   }}>
//                     Contact Support
//                   </Text>
//                 </Pressable>
//               </View>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default ForgotPassword;

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
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError("");
  };

  const handleResetPassword = async () => {
    if (isLoading) return;

    // Reset errors
    setEmailError("");

    // Validation
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with your actual forgot password service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // On success
      setEmailSent(true);
      
      // Optional: Show success alert
      Alert.alert(
        "Recovery Link Sent",
        "We've sent a password recovery link to your email. Check your inbox to regain access to your library.",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to send recovery link. Please try again or contact our reading support team."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = () => {
    setEmailSent(false);
    setEmail("");
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
            {/* Header Section */}
            <View style={{
              height: height * 0.35,
              backgroundColor: '#7c3aed',
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

              {/* Background Decorations - Lost Books Theme */}
              <View style={{
                position: 'absolute',
                top: -30,
                right: -35,
                width: 110,
                height: 140,
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: 8,
                transform: [{ rotate: '18deg' }]
              }} />
              <View style={{
                position: 'absolute',
                top: 80,
                left: -25,
                width: 85,
                height: 110,
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderRadius: 6,
                transform: [{ rotate: '-22deg' }]
              }} />
              <View style={{
                position: 'absolute',
                bottom: 40,
                right: 10,
                width: 65,
                height: 85,
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: 4,
                transform: [{ rotate: '30deg' }]
              }} />
              
              {/* Content */}
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 20
              }}>
                {/* Icon - Lost Key/Book */}
                <View style={{
                  width: 85,
                  height: 85,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 22,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 20,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.25)'
                }}>
                  <Ionicons name="help-circle-outline" size={40} color="white" />
                </View>
                
                <Text style={{
                  fontSize: 30,
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: 8,
                  textAlign: 'center',
                  letterSpacing: -0.5
                }}>
                  {emailSent ? "Check Your Inbox" : "Lost Your Key?"}
                </Text>
                <Text style={{
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.9)',
                  textAlign: 'center',
                  paddingHorizontal: 30,
                  lineHeight: 22,
                  fontStyle: 'italic'
                }}>
                  {emailSent 
                    ? "We've sent you the key to unlock your library"
                    : "We'll help you find your way back to your books"
                  }
                </Text>
              </View>
            </View>

            {/* Form Card */}
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
              
              {!emailSent ? (
                // Email Input Form
                <>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: 8,
                    textAlign: 'center'
                  }}>
                    Recover Your Library Access
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#6b7280',
                    marginBottom: 32,
                    textAlign: 'center',
                    lineHeight: 20,
                    paddingHorizontal: 10
                  }}>
                    Enter your email and we'll send you a link to reset your password and return to your books
                  </Text>

                  {/* Email Input */}
                  <View style={{ marginBottom: 24 }}>
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
                        placeholder="Enter your email address"
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

                  {/* Reset Password Button */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: isLoading ? '#d1d5db' : '#7c3aed',
                      paddingVertical: 16,
                      borderRadius: 12,
                      shadowColor: '#7c3aed',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: isLoading ? 0 : 0.3,
                      shadowRadius: 8,
                      elevation: isLoading ? 0 : 6,
                      marginBottom: 20
                    }}
                    onPress={handleResetPassword}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <Text style={{
                      color: 'white',
                      textAlign: 'center',
                      fontSize: 16,
                      fontWeight: '600'
                    }}>
                      {isLoading ? "Sending recovery key..." : "Send Recovery Link"}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                // Email Sent Success State
                <>
                  <View style={{ alignItems: 'center', marginBottom: 32 }}>
                    <View style={{
                      width: 60,
                      height: 60,
                      backgroundColor: '#f3e8ff',
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 20
                    }}>
                      <Ionicons name="mail" size={28} color="#7c3aed" />
                    </View>
                    
                    <Text style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#1f2937',
                      marginBottom: 8,
                      textAlign: 'center'
                    }}>
                      Recovery Key Sent
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: '#6b7280',
                      textAlign: 'center',
                      lineHeight: 20,
                      paddingHorizontal: 10
                    }}>
                      We've sent a password recovery link to{"\n"}
                      <Text style={{ fontWeight: '600', color: '#7c3aed' }}>
                        {email}
                      </Text>
                    </Text>
                  </View>

                  {/* Instructions */}
                  <View style={{
                    backgroundColor: '#f8faff',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 24,
                    borderWidth: 1,
                    borderColor: '#e0e7ff'
                  }}>
                    <Text style={{
                      fontSize: 14,
                      color: '#5b21b6',
                      fontWeight: '600',
                      marginBottom: 8,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}>
                      📖 Next Steps
                    </Text>
                    <Text style={{
                      fontSize: 13,
                      color: '#6d28d9',
                      lineHeight: 18
                    }}>
                      1. Check your email inbox{"\n"}
                      2. Click the recovery link in the email{"\n"}
                      3. Create a new password{"\n"}
                      4. Return to your book collection
                    </Text>
                  </View>

                  {/* Resend Button */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'white',
                      paddingVertical: 14,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: '#e0e7ff',
                      marginBottom: 20
                    }}
                    onPress={handleResendEmail}
                    activeOpacity={0.7}
                  >
                    <Text style={{
                      color: '#374151',
                      textAlign: 'center',
                      fontSize: 14,
                      fontWeight: '500'
                    }}>
                      Didn't receive the email? Send again
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Back to Login */}
              <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                <Pressable 
                  onPress={() => router.back()}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Ionicons name="arrow-back-outline" size={16} color="#7c3aed" />
                  <Text style={{
                    marginLeft: 6,
                    color: '#7c3aed',
                    fontSize: 14,
                    fontWeight: '600'
                  }}>
                    Back to Library Login
                  </Text>
                </Pressable>
              </View>

              {/* Support */}
              <View style={{
                alignItems: 'center',
                paddingBottom: 20,
                borderTopWidth: 1,
                borderTopColor: '#f3f4f6',
                marginTop: 20,
                paddingTop: 20
              }}>
                <Text style={{
                  color: '#6b7280',
                  fontSize: 12,
                  textAlign: 'center',
                  marginBottom: 8
                }}>
                  Still can't access your library?
                </Text>
                <Pressable hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={{
                    color: '#7c3aed',
                    fontSize: 12,
                    fontWeight: '600',
                    textDecorationLine: 'underline'
                  }}>
                    Contact Reader Support
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;