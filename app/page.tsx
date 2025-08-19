"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Navigation, Phone, Settings, Volume2, Camera, User, MapPin, Check, Route, ArrowLeft, Edit } from "lucide-react"
import { speak } from "@/utils/speak" // Declare the speak variable

type Screen =
  | "user-name"
  | "step-setup"
  | "voice-setup"
  | "guardian-setup"
  | "mode-select"
  | "main-camera"
  | "main-navigation"
  | "guardian-calling"
  | "settings-main"
  | "settings-step"
  | "settings-voice"
  | "settings-guardian"
type Mode = "camera" | "navigation"

interface GuardianInfo {
  name: string
  phone: string
}

export default function AEyeApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("user-name")
  const [previousScreen, setPreviousScreen] = useState<Screen>("main-camera")
  const [selectedMode, setSelectedMode] = useState<Mode>("camera")
  const [userName, setUserName] = useState("")
  const [stepSize, setStepSize] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [voiceSpeed, setVoiceSpeed] = useState([1.0])
  const [voiceType, setVoiceType] = useState<"female" | "male">("female")
  const [guardian, setGuardian] = useState<GuardianInfo>({ name: "", phone: "" })
  const [currentAnnouncement, setCurrentAnnouncement] = useState("")
  const [detectedObjects, setDetectedObjects] = useState<
    Array<{
      name: string
      distance: string
      position: string
      x: number
      y: number
    }>
  >([])
  const [navigationRoute, setNavigationRoute] = useState<string[]>([])

  // 보폭 측정 시뮬레이션
  const measureStepSize = () => {
    speak(`${userName}님, 측정을 시작했습니다! 이제 10미터를 걸어주세요.`)
    setIsRecording(true)
    setTimeout(() => {
      const measured = Math.floor(Math.random() * 20) + 65
      setStepSize(measured)
      setIsRecording(false)
      speak(`측정이 완료되었습니다. '다음 단계'라고 말씀해주세요.`)
    }, 4000)
  }

  // 객체 인식 시뮬레이션
  const simulateObjectDetection = () => {
    const objects = [
      { name: "의자", distance: "2m", position: "정면", x: 50, y: 55 },
      { name: "테이블", distance: "3m", position: "우측", x: 75, y: 40 },
      { name: "문", distance: "5m", position: "좌측", x: 25, y: 35 },
    ]
    setDetectedObjects(objects)
    speak("정면 2미터에 의자, 우측 3미터에 테이블, 좌측 5미터에 문이 있습니다.")
  }

  // 길찾기 시뮬레이션
  const simulateNavigation = () => {
    const routes = ["10미터 직진 후 우회전", "50미터 직진", "좌회전 후 20미터 직진", "목적지 도착"]
    setNavigationRoute(routes)
    speak("길찾기를 시작합니다. 10미터 직진 후 우회전하세요.")
  }

  // 보호자 호출 시뮬레이션
  const callGuardian = () => {
    setCurrentScreen("guardian-calling")
    speak(`${guardian.name}님에게 긴급 호출 메시지를 전송합니다.`)
  }

  // 설정 메뉴 열기
  const openSettings = () => {
    setPreviousScreen(currentScreen as Screen)
    setCurrentScreen("settings-main")
    speak("설정 메뉴입니다.")
  }

  // 설정에서 뒤로 가기
  const goBackFromSettings = () => {
    setCurrentScreen(previousScreen)
    speak("이전 화면으로 돌아갑니다.")
  }

  // 화면별 초기 음성 안내
  useEffect(() => {
    switch (currentScreen) {
      case "user-name":
        speak("A아이 앱에 오신 것을 환영합니다. 먼저 사용자 이름을 입력해주세요.")
        break
      case "step-setup":
        speak(`안녕하세요 ${userName}님. 이제 보폭을 측정해보겠습니다.`)
        break
      case "voice-setup":
        speak("음성 설정을 진행합니다. 원하는 음성 종류와 속도를 선택해주세요.")
        break
      case "guardian-setup":
        speak("보호자 정보를 등록해주세요. 긴급 상황 시 연락할 분의 정보입니다.")
        break
      case "mode-select":
        speak("사용할 모드를 선택해주세요. 카메라 모드 또는 길찾기 모드를 선택할 수 있습니다.")
        break
      case "main-camera":
        speak(`${userName}님, 카메라 모드가 활성화되었습니다.`)
        setTimeout(simulateObjectDetection, 2000)
        break
      case "main-navigation":
        speak(`${userName}님, 길찾기 모드가 활성화되었습니다.`)
        setTimeout(simulateNavigation, 2000)
        break
      case "guardian-calling":
        setTimeout(() => {
          speak("긴급 메시지가 성공적으로 전송되었습니다.")
        }, 3000)
        break
      case "settings-main":
        speak("설정 메뉴입니다. 보폭 설정, 음성 설정, 보호자 설정을 변경할 수 있습니다.")
        break
      case "settings-step":
        speak("보폭 설정입니다. 현재 보폭을 확인하고 재측정할 수 있습니다.")
        break
      case "settings-voice":
        speak("음성 설정입니다. 음성 종류와 속도를 변경할 수 있습니다.")
        break
      case "settings-guardian":
        speak("보호자 설정입니다. 등록된 보호자 정보를 수정할 수 있습니다.")
        break
    }
  }, [currentScreen, userName])

  const renderScreen = () => {
    switch (currentScreen) {
      case "user-name":
        return (
          <div className="p-6 space-y-6">
            {/* 헤더 */}
            <div className="text-center pt-8">
              <h1 className="text-4xl font-bold mb-2 text-white">A:EYE</h1>
              <p className="text-lg text-gray-400">사용자 정보 입력</p>
            </div>

            {/* 현재 안내 메시지 */}
            {currentAnnouncement && (
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-gray-300" />
                    <span className="text-sm text-gray-300">{currentAnnouncement}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 사용자 이름 입력 */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-6 h-6" />
                  사용자 이름
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-lg font-medium mb-3 text-gray-300">이름을 입력해주세요</label>
                  <Input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="예: 홍길동"
                    className="h-16 text-xl bg-gray-800 border-gray-600 text-white placeholder-gray-400 text-center"
                    onFocus={() => speak("이름을 입력해주세요.")}
                  />
                </div>
                <p className="text-sm text-gray-400 text-center">입력하신 이름은 음성 안내 시 사용됩니다</p>
              </CardContent>
            </Card>

            {/* 다음 버튼 */}
            <Button
              onClick={() => {
                if (userName.trim()) {
                  speak(`안녕하세요 ${userName}님. 이제 보폭 측정을 진행하겠습니다.`)
                  setTimeout(() => setCurrentScreen("step-setup"), 2000)
                } else {
                  speak("이름을 입력해주세요.")
                }
              }}
              disabled={!userName.trim()}
              className="w-full h-16 text-xl font-bold bg-white text-black hover:bg-gray-200"
            >
              다음 단계
            </Button>
          </div>
        )

      case "step-setup":
        return (
          <div className="p-6 space-y-6">
            <div className="text-center pt-8">
              <h1 className="text-4xl font-bold mb-2 text-white">A:EYE</h1>
              <p className="text-lg text-gray-400">안녕하세요 {userName}님</p>
              <p className="text-md text-gray-500">1단계: 보폭 측정</p>
            </div>

            {currentAnnouncement && (
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-gray-300" />
                    <span className="text-sm text-gray-300">{currentAnnouncement}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Navigation className="w-6 h-6" />
                  {userName}님의 보폭 측정
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* 카메라 뷰 시뮬레이션 */}
                {isRecording && (
                  <div className="w-full h-48 bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                    <Camera className="w-12 h-12 text-gray-500 opacity-50" />
                    <div className="absolute inset-0 bg-black/20">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-8 h-8 border-2 border-white/60 rounded-full flex items-center justify-center">
                          <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={measureStepSize}
                  disabled={isRecording || stepSize > 0}
                  className="w-full h-20 text-xl font-bold bg-gray-700 hover:bg-gray-600 text-white"
                >
                  {isRecording ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      측정 중...
                    </div>
                  ) : stepSize > 0 ? (
                    `측정 완료: ${stepSize}cm`
                  ) : (
                    "보폭 측정 시작"
                  )}
                </Button>
                <p className="text-sm text-gray-400 mt-3 text-center">
                  {isRecording ? "카메라를 보며 자연스럽게 걸어주세요" : "평소처럼 자연스럽게 10미터 걸어주세요"}
                </p>
              </CardContent>
            </Card>

            <Button
              onClick={() => {
                if (stepSize > 0) {
                  setCurrentScreen("voice-setup")
                } else {
                  speak("먼저 보폭을 측정해주세요.")
                }
              }}
              disabled={stepSize === 0}
              className="w-full h-16 text-xl font-bold bg-white text-black hover:bg-gray-200"
            >
              다음 단계
            </Button>
          </div>
        )

      case "voice-setup":
        return (
          <div className="p-6 space-y-6">
            <div className="text-center pt-8">
              <h1 className="text-4xl font-bold mb-2 text-white">A:EYE</h1>
              <p className="text-lg text-gray-400">2단계: 음성 설정</p>
            </div>

            {currentAnnouncement && (
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-gray-300" />
                    <span className="text-sm text-gray-300">{currentAnnouncement}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Volume2 className="w-6 h-6" />
                  음성 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-lg font-medium mb-3 text-gray-300">음성 종류</label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={voiceType === "female" ? "default" : "outline"}
                      onClick={() => {
                        setVoiceType("female")
                        speak(`${userName}님, 여성 음성으로 설정되었습니다.`)
                      }}
                      className={`h-16 text-lg font-bold ${
                        voiceType === "female"
                          ? "bg-white text-black hover:bg-gray-200"
                          : "bg-gray-700 text-white hover:bg-gray-600 border-gray-600"
                      }`}
                    >
                      여성 음성
                    </Button>
                    <Button
                      variant={voiceType === "male" ? "default" : "outline"}
                      onClick={() => {
                        setVoiceType("male")
                        speak(`${userName}님, 남성 음성으로 설정되었습니다.`)
                      }}
                      className={`h-16 text-lg font-bold ${
                        voiceType === "male"
                          ? "bg-white text-black hover:bg-gray-200"
                          : "bg-gray-700 text-white hover:bg-gray-600 border-gray-600"
                      }`}
                    >
                      남성 음성
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-gray-300">음성 속도: {voiceSpeed[0]}배속</label>
                  <Slider
                    value={voiceSpeed}
                    onValueChange={(value) => {
                      setVoiceSpeed(value)
                      speak(`${userName}님, 음성 속도가 ${value[0]}배속으로 설정되었습니다.`)
                    }}
                    max={2}
                    min={0.5}
                    step={0.1}
                    className="w-full h-6"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>느림 (0.5x)</span>
                    <span>빠름 (2.0x)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => setCurrentScreen("guardian-setup")}
              className="w-full h-16 text-xl font-bold bg-white text-black hover:bg-gray-200"
            >
              다음 단계
            </Button>
          </div>
        )

      case "guardian-setup":
        return (
          <div className="p-6 space-y-6">
            <div className="text-center pt-8">
              <h1 className="text-4xl font-bold mb-2 text-white">A:EYE</h1>
              <p className="text-lg text-gray-400">3단계: 보호자 등록</p>
            </div>

            {currentAnnouncement && (
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-gray-300" />
                    <span className="text-sm text-gray-300">{currentAnnouncement}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-6 h-6" />
                  보호자 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-lg font-medium mb-2 text-gray-300">이름</label>
                  <Input
                    value={guardian.name}
                    onChange={(e) => setGuardian({ ...guardian, name: e.target.value })}
                    placeholder="보호자 이름을 입력하세요"
                    className="h-14 text-lg bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2 text-gray-300">전화번호</label>
                  <Input
                    value={guardian.phone}
                    onChange={(e) => setGuardian({ ...guardian, phone: e.target.value })}
                    placeholder="010-0000-0000"
                    className="h-14 text-lg bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <p className="text-sm text-gray-400">긴급 상황 시 GPS 위치와 함께 문자 메시지가 전송됩니다</p>
              </CardContent>
            </Card>

            <Button
              onClick={() => {
                if (guardian.name && guardian.phone) {
                  speak(`${guardian.name}님이 보호자로 등록되었습니다.`)
                  setTimeout(() => setCurrentScreen("mode-select"), 2000)
                } else {
                  speak("보호자 이름과 전화번호를 모두 입력해주세요.")
                }
              }}
              disabled={!guardian.name || !guardian.phone}
              className="w-full h-16 text-xl font-bold bg-white text-black hover:bg-gray-200"
            >
              다음 단계
            </Button>
          </div>
        )

      case "mode-select":
        return (
          <div className="p-6 space-y-6">
            <div className="text-center pt-8">
              <h1 className="text-4xl font-bold mb-2 text-white">A:EYE</h1>
              <p className="text-lg text-gray-400">4단계: 모드 선택</p>
            </div>

            {currentAnnouncement && (
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-gray-300" />
                    <span className="text-sm text-gray-300">{currentAnnouncement}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-6">
              <Button
                onClick={() => {
                  setSelectedMode("camera")
                  setCurrentScreen("main-camera")
                  speak(`${userName}님, 카메라 모드로 A아이를 시작합니다.`)
                }}
                className="w-full h-32 bg-gray-900 hover:bg-gray-800 border-2 border-gray-700 hover:border-white transition-all rounded-2xl"
              >
                <div className="flex flex-col items-center gap-4">
                  <Camera className="w-16 h-16 text-gray-300" />
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-white mb-2">카메라 모드</h3>
                    <p className="text-lg text-gray-400">실시간 객체 인식 및 위험 감지</p>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => {
                  setSelectedMode("navigation")
                  setCurrentScreen("main-navigation")
                  speak(`${userName}님, 길찾기 모드로 A아이를 시작합니다.`)
                }}
                className="w-full h-32 bg-gray-900 hover:bg-gray-800 border-2 border-gray-700 hover:border-white transition-all rounded-2xl"
              >
                <div className="flex flex-col items-center gap-4">
                  <Route className="w-16 h-16 text-gray-300" />
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-white mb-2">길찾기 모드</h3>
                    <p className="text-lg text-gray-400">음성 길 안내 및 경로 탐색</p>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        )

      case "settings-main":
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center pt-8 mb-6">
              <Button onClick={goBackFromSettings} className="mr-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-full">
                <ArrowLeft className="w-6 h-6 text-white" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">설정</h1>
                <p className="text-lg text-gray-400">앱 설정을 변경할 수 있습니다</p>
              </div>
            </div>

            {currentAnnouncement && (
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-gray-300" />
                    <span className="text-sm text-gray-300">{currentAnnouncement}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <Card
                className="bg-gray-900 border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => {
                  setCurrentScreen("settings-step")
                  speak("보폭 설정으로 이동합니다.")
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Navigation className="w-8 h-8 text-gray-300" />
                      <div>
                        <h3 className="text-xl font-bold text-white">보폭 설정</h3>
                        <p className="text-gray-400">현재: {stepSize}cm</p>
                      </div>
                    </div>
                    <Edit className="w-6 h-6 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card
                className="bg-gray-900 border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => {
                  setCurrentScreen("settings-voice")
                  speak("음성 설정으로 이동합니다.")
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Volume2 className="w-8 h-8 text-gray-300" />
                      <div>
                        <h3 className="text-xl font-bold text-white">음성 설정</h3>
                        <p className="text-gray-400">
                          {voiceType === "female" ? "여성" : "남성"} 음성, {voiceSpeed[0]}배속
                        </p>
                      </div>
                    </div>
                    <Edit className="w-6 h-6 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card
                className="bg-gray-900 border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => {
                  setCurrentScreen("settings-guardian")
                  speak("보호자 설정으로 이동합니다.")
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <User className="w-8 h-8 text-gray-300" />
                      <div>
                        <h3 className="text-xl font-bold text-white">보호자 설정</h3>
                        <p className="text-gray-400">
                          {guardian.name} ({guardian.phone})
                        </p>
                      </div>
                    </div>
                    <Edit className="w-6 h-6 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "settings-step":
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center pt-8 mb-6">
              <Button
                onClick={() => {
                  setCurrentScreen("settings-main")
                  speak("설정 메뉴로 돌아갑니다.")
                }}
                className="mr-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-full"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">보폭 설정</h1>
                <p className="text-lg text-gray-400">보폭을 재측정할 수 있습니다</p>
              </div>
            </div>

            {currentAnnouncement && (
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-gray-300" />
                    <span className="text-sm text-gray-300">{currentAnnouncement}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Navigation className="w-6 h-6" />
                  {userName}님의 현재 보폭
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="text-4xl font-bold text-white mb-2">{stepSize}cm</div>
                  <p className="text-gray-400">현재 설정된 보폭입니다</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">보폭 재측정</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => {
                    setStepSize(0)
                    measureStepSize()
                  }}
                  disabled={isRecording}
                  className="w-full h-20 text-xl font-bold bg-gray-700 hover:bg-gray-600 text-white"
                >
                  {isRecording ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      측정 중...
                    </div>
                  ) : (
                    "보폭 다시 측정하기"
                  )}
                </Button>
                <p className="text-sm text-gray-400 mt-3 text-center">평소처럼 자연스럽게 10걸음 걸어주세요</p>
              </CardContent>
            </Card>

            <Button
              onClick={() => {
                setCurrentScreen("settings-main")
                speak("설정이 저장되었습니다.")
              }}
              className="w-full h-16 text-xl font-bold bg-white text-black hover:bg-gray-200"
            >
              설정 저장
            </Button>
          </div>
        )

      case "settings-voice":
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center pt-8 mb-6">
              <Button
                onClick={() => {
                  setCurrentScreen("settings-main")
                  speak("설정 메뉴로 돌아갑니다.")
                }}
                className="mr-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-full"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">음성 설정</h1>
                <p className="text-lg text-gray-400">음성 종류와 속도를 변경할 수 있습니다</p>
              </div>
            </div>

            {currentAnnouncement && (
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-gray-300" />
                    <span className="text-sm text-gray-300">{currentAnnouncement}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Volume2 className="w-6 h-6" />
                  음성 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-lg font-medium mb-3 text-gray-300">음성 종류</label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={voiceType === "female" ? "default" : "outline"}
                      onClick={() => {
                        setVoiceType("female")
                        speak(`${userName}님, 여성 음성으로 변경되었습니다.`)
                      }}
                      className={`h-16 text-lg font-bold ${
                        voiceType === "female"
                          ? "bg-white text-black hover:bg-gray-200"
                          : "bg-gray-700 text-white hover:bg-gray-600 border-gray-600"
                      }`}
                    >
                      여성 음성
                    </Button>
                    <Button
                      variant={voiceType === "male" ? "default" : "outline"}
                      onClick={() => {
                        setVoiceType("male")
                        speak(`${userName}님, 남성 음성으로 변경되었습니다.`)
                      }}
                      className={`h-16 text-lg font-bold ${
                        voiceType === "male"
                          ? "bg-white text-black hover:bg-gray-200"
                          : "bg-gray-700 text-white hover:bg-gray-600 border-gray-600"
                      }`}
                    >
                      남성 음성
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-gray-300">음성 속도: {voiceSpeed[0]}배속</label>
                  <Slider
                    value={voiceSpeed}
                    onValueChange={(value) => {
                      setVoiceSpeed(value)
                      speak(`${userName}님, 음성 속도가 ${value[0]}배속으로 변경되었습니다.`)
                    }}
                    max={2}
                    min={0.5}
                    step={0.1}
                    className="w-full h-6"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>느림 (0.5x)</span>
                    <span>빠름 (2.0x)</span>
                  </div>
                </div>

                <Button
                  onClick={() => speak(`${userName}님, 현재 설정된 음성으로 테스트 메시지입니다.`)}
                  className="w-full h-12 text-lg font-bold bg-gray-700 hover:bg-gray-600 text-white"
                >
                  음성 테스트
                </Button>
              </CardContent>
            </Card>

            <Button
              onClick={() => {
                setCurrentScreen("settings-main")
                speak("음성 설정이 저장되었습니다.")
              }}
              className="w-full h-16 text-xl font-bold bg-white text-black hover:bg-gray-200"
            >
              설정 저장
            </Button>
          </div>
        )

      case "settings-guardian":
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center pt-8 mb-6">
              <Button
                onClick={() => {
                  setCurrentScreen("settings-main")
                  speak("설정 메뉴로 돌아갑니다.")
                }}
                className="mr-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-full"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">보호자 설정</h1>
                <p className="text-lg text-gray-400">보호자 정보를 수정할 수 있습니다</p>
              </div>
            </div>

            {currentAnnouncement && (
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-gray-300" />
                    <span className="text-sm text-gray-300">{currentAnnouncement}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-6 h-6" />
                  보호자 정보 수정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-lg font-medium mb-2 text-gray-300">이름</label>
                  <Input
                    value={guardian.name}
                    onChange={(e) => setGuardian({ ...guardian, name: e.target.value })}
                    placeholder="보호자 이름을 입력하세요"
                    className="h-14 text-lg bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2 text-gray-300">전화번호</label>
                  <Input
                    value={guardian.phone}
                    onChange={(e) => setGuardian({ ...guardian, phone: e.target.value })}
                    placeholder="010-0000-0000"
                    className="h-14 text-lg bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <p className="text-sm text-gray-400">긴급 상황 시 GPS 위치와 함께 문자 메시지가 전송됩니다</p>
              </CardContent>
            </Card>

            <Button
              onClick={() => {
                if (guardian.name && guardian.phone) {
                  setCurrentScreen("settings-main")
                  speak(`${guardian.name}님의 정보가 업데이트되었습니다.`)
                } else {
                  speak("보호자 이름과 전화번호를 모두 입력해주세요.")
                }
              }}
              disabled={!guardian.name || !guardian.phone}
              className="w-full h-16 text-xl font-bold bg-white text-black hover:bg-gray-200"
            >
              설정 저장
            </Button>
          </div>
        )

      case "main-camera":
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900">
              <div className="w-full h-full relative flex items-center justify-center">
                <Camera className="w-16 h-16 text-gray-600 opacity-30" />
                <div className="absolute inset-0 bg-black/10">
                  {detectedObjects.map((obj, index) => (
                    <div
                      key={index}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${obj.x}%`, top: `${obj.y}%` }}
                    >
                      <div className="bg-white/90 text-black px-2 py-1 rounded-md text-xs font-medium shadow-lg">
                        {obj.name} ({obj.distance})
                      </div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute top-12 left-0 right-0 z-10">
              <div className="flex justify-between items-center px-4 py-2">
                <Badge variant="secondary" className="bg-black/70 text-white text-sm px-3 py-1">
                  카메라 모드 - {userName}님
                </Badge>
              </div>

              {currentAnnouncement && (
                <div className="mx-4 mt-2">
                  <div className="bg-black/80 text-white p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      <span className="text-sm font-medium leading-tight">{currentAnnouncement}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute bottom-8 left-0 right-0 z-10">
              <div className="bg-black/80 backdrop-blur-sm mx-4 rounded-2xl p-4">
                <div className="grid grid-cols-4 gap-3">
                  <Button
                    onClick={() => {
                      speak("주변 안내 모드입니다.")
                      setTimeout(() => speak("주변에 계단이 있습니다. 조심하세요. 우측에 벤치가 있습니다."), 3000)
                    }}
                    className="h-16 w-full flex flex-col items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-medium text-xs rounded-xl"
                  >
                    <Volume2 className="w-6 h-6 mb-1" />
                    <span>주변안내</span>
                  </Button>

                  <Button
                    onClick={() => {
                      setCurrentScreen("main-navigation")
                      speak("길찾기 모드로 전환합니다.")
                    }}
                    className="h-16 w-full flex flex-col items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-medium text-xs rounded-xl"
                  >
                    <Navigation className="w-6 h-6 mb-1" />
                    <span>길찾기</span>
                  </Button>

                  <Button
                    onClick={callGuardian}
                    className="h-16 w-full flex flex-col items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-medium text-xs rounded-xl"
                  >
                    <Phone className="w-6 h-6 mb-1" />
                    <span>보호자호출</span>
                  </Button>

                  <Button
                    onClick={openSettings}
                    className="h-16 w-full flex flex-col items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-medium text-xs rounded-xl"
                  >
                    <Settings className="w-6 h-6 mb-1" />
                    <span>설정</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-5">
              <div className="w-12 h-12 border-2 border-white/40 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
              </div>
            </div>

            <div
              className="absolute inset-0 z-0"
              onClick={simulateObjectDetection}
              aria-label="화면을 터치하면 주변 객체를 다시 인식합니다"
            />
          </>
        )

      case "main-navigation":
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900">
              <div className="w-full h-full relative flex items-center justify-center">
                <Route className="w-16 h-16 text-gray-600 opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/80 p-6 rounded-2xl max-w-xs">
                    <h3 className="text-xl font-bold text-white mb-4 text-center">경로 안내</h3>
                    {navigationRoute.length > 0 && (
                      <div className="space-y-2">
                        {navigationRoute.map((step, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg ${index === 0 ? "bg-white text-black" : "bg-gray-700 text-gray-300"}`}
                          >
                            <span className="text-sm font-medium">
                              {index + 1}. {step}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-12 left-0 right-0 z-10">
              <div className="flex justify-between items-center px-4 py-2">
                <Badge variant="secondary" className="bg-black/70 text-white text-sm px-3 py-1">
                  길찾기 모드 - {userName}님
                </Badge>
              </div>

              {currentAnnouncement && (
                <div className="mx-4 mt-2">
                  <div className="bg-black/80 text-white p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      <span className="text-sm font-medium leading-tight">{currentAnnouncement}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute bottom-8 left-0 right-0 z-10">
              <div className="bg-black/80 backdrop-blur-sm mx-4 rounded-2xl p-4">
                <div className="grid grid-cols-4 gap-3">
                  <Button
                    onClick={() => {
                      speak("주변 안내 모드입니다.")
                      setTimeout(() => speak("주변에 계단이 있습니다. 조심하세요. 우측에 벤치가 있습니다."), 3000)
                    }}
                    className="h-16 w-full flex flex-col items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-medium text-xs rounded-xl"
                  >
                    <Volume2 className="w-6 h-6 mb-1" />
                    <span>주변안내</span>
                  </Button>

                  <Button
                    onClick={() => {
                      setCurrentScreen("main-camera")
                      speak("카메라 모드로 전환합니다.")
                    }}
                    className="h-16 w-full flex flex-col items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-medium text-xs rounded-xl"
                  >
                    <Camera className="w-6 h-6 mb-1" />
                    <span>카메라</span>
                  </Button>

                  <Button
                    onClick={callGuardian}
                    className="h-16 w-full flex flex-col items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-medium text-xs rounded-xl"
                  >
                    <Phone className="w-6 h-6 mb-1" />
                    <span>보호자호출</span>
                  </Button>

                  <Button
                    onClick={openSettings}
                    className="h-16 w-full flex flex-col items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-medium text-xs rounded-xl"
                  >
                    <Settings className="w-6 h-6 mb-1" />
                    <span>설정</span>
                  </Button>
                </div>
              </div>
            </div>

            <div
              className="absolute inset-0 z-0"
              onClick={simulateNavigation}
              aria-label="화면을 터치하면 경로를 다시 탐색합니다"
            />
          </>
        )

      case "guardian-calling":
        return (
          <div className="p-6 space-y-6 flex flex-col justify-center h-full">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-white">보호자 호출</h2>
              <p className="text-lg text-gray-400">긴급 메시지 전송 중...</p>
            </div>

            {currentAnnouncement && (
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-gray-300" />
                    <span className="text-sm text-gray-300">{currentAnnouncement}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-6 h-6" />
                  전송 대상
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-xl font-bold text-white">{guardian.name}</p>
                  <p className="text-lg text-gray-300">{guardian.phone}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  전송 내용
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-white text-sm leading-relaxed">
                    🚨 <strong>A:EYE 긴급 호출</strong>
                    <br />
                    {guardian.name}님, {userName}님이 도움이 필요합니다.
                    <br />
                    <br />📍 <strong>현재 위치:</strong>
                    <br />
                    서울시 강남구 테헤란로 123
                    <br />
                    (위도: 37.5665, 경도: 126.9780)
                    <br />
                    <br />⏰ <strong>발생 시간:</strong>
                    <br />
                    {new Date().toLocaleString("ko-KR")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-600">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-gray-300" />
                  <span className="text-lg font-medium text-gray-300">메시지 전송 완료</span>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => {
                if (selectedMode === "camera") {
                  setCurrentScreen("main-camera")
                } else {
                  setCurrentScreen("main-navigation")
                }
                speak("메인 화면으로 돌아갑니다.")
              }}
              className="w-full h-16 text-xl font-bold bg-white text-black hover:bg-gray-200"
            >
              메인 화면으로 돌아가기
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="relative w-[390px] h-[844px] bg-black rounded-[40px] shadow-2xl overflow-hidden border-8 border-gray-800">
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-50"></div>
        <div className="absolute inset-0 text-white overflow-y-auto">{renderScreen()}</div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full z-50"></div>
      </div>
    </div>
  )
}
