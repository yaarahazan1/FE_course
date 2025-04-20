import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
import { Calendar, BookOpen, CheckSquare, PenLine, Users, BarChart } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import AdminBadge from "@/components/AdminBadge";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F1F0E8] to-[#E5E1DA]/30 direction-rtl">
      {/* Admin Badge - position in top left (right in RTL) */}
      {/* <AdminBadge /> */}

      {/* Header/Navbar */}
      <header className="bg-white border-b border-[#E5E1DA] shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold mr-4 text-[#89A8B2]">סטודנט חכם</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/dashboard">
            <Button variant="outline" className="border-[#E5E1DA] ml-2 hover:bg-[#F9F9F9] bg-[#89A8B2]">
              <BarChart className="h-4 w-4 ml-2 text-black" />
              לוח מחוונים
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="border-[#E5E1DA] hover:bg-[#F9F9F9] bg-[#89A8B2]">
              כניסה / הרשמה
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      {/* <section className="bg-gradient-to-r from-[#E5E1DA] to-[#F9F9F9] text-center py-16 px-4">
        <h1 className="text-4xl font-bold mb-6 text-[#89A8B2]">סטודנט חכם</h1>
        <p className="text-lg max-w-2xl mx-auto mb-4 text-[#464646]">
          נהל את הלימודים שלך בצורה חכמה - גישה מהירה לסיכומים, משימות ולוח זמנים מותאם אישית
        </p>
        <p className="text-lg max-w-2xl mx-auto text-[#464646]">
          המערכת עוזרת לך לארגן את הלימודים שלך, לשתף סיכומים, לעקוב אחרי משימות והגשות לוח זמנים מותאם לסיכומים והחומרים האישיים שלך.
        </p>
      </section> */}

      {/* Features Section */}
      {/* <section className="py-10 px-4 bg-[#F9F9F9]">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-6xl mx-auto"> */}
          {/* Feature cards */}
          {/* <Card className="border-2 border-[#E5E1DA] shadow-sm hover:shadow-md transition-shadow bg-white h-full bg-[#E5E1DA]">
            <CardContent className="flex flex-col items-center text-center p-6">
              <Calendar className="h-10 w-10 mb-4 text-[#89A8B2]" />
              <h3 className="font-bold text-lg mb-2">ניהול לוח זמנים</h3>
              <p className="text-sm">
                סדר את לוח הזמנים שלך עם כל מה שמרכיב את היום שלך וצור את לוח הזמנים החכם
              </p>
              <Link to="/time-management" className="mt-4">
                <Button variant="outline" size="sm" className="w-full border-[#E5E1DA] hover:bg-[#F9F9F9] hover:text-[#89A8B2]">
                  למעבר
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#E5E1DA] shadow-sm hover:shadow-md transition-shadow bg-white h-full bg-[#E5E1DA]">
            <CardContent className="flex flex-col items-center text-center p-6">
              <BookOpen className="h-10 w-10 mb-4 text-[#89A8B2]" />
              <h3 className="font-bold text-lg mb-2">ספריית סיכומים</h3>
              <p className="text-sm">
                גישה מהירה לספריית הסיכומים שלך, למידה משותפת וסיכומים מאורגנים
              </p>
              <Link to="/summary-library" className="mt-4">
                <Button variant="outline" size="sm" className="w-full border-[#E5E1DA] hover:bg-[#F9F9F9] hover:text-[#89A8B2]">
                  למעבר
                </Button>
              </Link>
            </CardContent>
          </Card> */}

          {/* Feature 3 */}
          {/* <Card className="border-2 border-[#E5E1DA] shadow-sm hover:shadow-md transition-shadow bg-white h-full bg-[#E5E1DA]">
            <CardContent className="flex flex-col items-center text-center p-6">
              <CheckSquare className="h-10 w-10 mb-4 text-[#89A8B2]" />
              <h3 className="font-bold text-lg mb-2">ניהול משימות ופרויקטים</h3>
              <p className="text-sm">
                סכם אחרי משימות, הבנת מה יש לסיים ופרויקטים עם צ׳אט קבוצתי והתראות
              </p>
              <Link to="/course-management" className="mt-4">
                <Button variant="outline" size="sm" className="w-full border-[#E5E1DA] hover:bg-[#F9F9F9] hover:text-[#89A8B2]">
                  למעבר
                </Button>
              </Link>
            </CardContent>
          </Card> */}

          {/* Feature 4 */}
          {/* <Card className="border-2 border-[#E5E1DA] shadow-sm hover:shadow-md transition-shadow bg-white h-full bg-[#E5E1DA]">
            <CardContent className="flex flex-col items-center text-center p-6">
              <PenLine className="h-10 w-10 mb-4 text-[#89A8B2]" />
              <h3 className="font-bold text-lg mb-2">כלי לכתיבה אקדמית</h3>
              <p className="text-sm">
                כתיבת עבודות וסיכומים עם ציטוטים אקדמיים מובנים
              </p>
              <Link to="/academic-writing" className="mt-4">
                <Button variant="outline" size="sm" className="w-full border-[#E5E1DA] hover:bg-[#F9F9F9] hover:text-[#89A8B2]">
                  למעבר
                </Button>
              </Link>
            </CardContent>
          </Card> */}

          {/* Feature 5 - Updated with Link to Social Network */}
          {/* <Card className="border-2 border-[#E5E1DA] shadow-sm hover:shadow-md transition-shadow bg-white h-full bg-[#E5E1DA]">
            <CardContent className="flex flex-col items-center text-center p-6">
              <Users className="h-10 w-10 mb-4 text-[#89A8B2]" />
              <h3 className="font-bold text-lg mb-2">רשת חברתית לסטודנטים</h3>
              <p className="text-sm">
                התחברי לפי קורסים ותחומי לימודים וקבלי סיכומים
              </p>
              <Link to="/social-network" className="mt-4">
                <Button variant="outline" size="sm" className="w-full border-[#E5E1DA] hover:bg-[#F9F9F9] hover:text-[#89A8B2]">
                  למעבר
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section> */}

      {/* Footer */}
      {/* <footer className="bg-[#F9F9F9] border-t border-[#E5E1DA] pt-6 mt-auto text-center">
        <div className="container mx-auto px-4 pb-6">
          <div className="flex flex-col md:flex-row justify-center items-center md:space-x-8 rtl:space-x-reverse space-y-4 md:space-y-0">
            <Link to="/help-settings" className="text-[#89A8B2] hover:text-[#89A8B2]/80 transition-colors hover:underline">
              עזרה והגדרות
            </Link>
            <span className="hidden md:inline text-[#E5E1DA]">|</span>
            <div className="text-[#89A8B2] hover:text-[#89A8B2]/80 transition-colors hover:underline cursor-pointer">
              תנאי שימוש
            </div>
            <span className="hidden md:inline text-[#E5E1DA]">|</span>
            <div className="text-[#89A8B2] hover:text-[#89A8B2]/80 transition-colors hover:underline cursor-pointer">
              מדיניות פרטיות
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default HomePage;
