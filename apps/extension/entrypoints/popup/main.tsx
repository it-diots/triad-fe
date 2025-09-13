import { createRoot } from "react-dom/client";
import { Button } from "@ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import { Badge } from "@ui/components/badge";
import "@/assets/tailwind.css";

function App() {
  return (
    <div className="min-h-[400px] w-80 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="space-y-4 p-4">
        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-800">
                Triad Extension
              </CardTitle>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                활성
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm font-medium text-blue-700">
                ✨ 확장프로그램이 성공적으로 로드되었습니다!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="default"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => console.log("설정 클릭!")}
              >
                설정
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log("도움말 클릭!")}
              >
                도움말
              </Button>
            </div>

            <div className="border-t border-gray-200 pt-2">
              <p className="text-center text-xs text-gray-500">
                버전 0.0.1 | Made with ❤️
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
