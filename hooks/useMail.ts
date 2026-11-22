import { useEffect, useState } from "react";
import Mailjs from "@cemalgnlts/mailjs";
import type { TempMailMessage, MailEvent } from "@/app/types";

export default function useMail() {
  const [tempEmail, setTempEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [messages, setMessages] = useState<TempMailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] =
    useState<TempMailMessage | null>(null);
  const [toastMessage, setToastMessage] = useState<TempMailMessage | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    const mailjs = new Mailjs();

    const init = async () => {
      setEmailLoading(true);
      setEmailError("");
      try {
        const account = await mailjs.createOneAccount();
        if (!account.status) {
          throw new Error(account.message || "创建临时邮箱失败");
        }
        const login = await mailjs.login(
          account.data.username,
          account.data.password
        );
        if (!login.status) throw new Error(login.message || "临时邮箱登录失败");
        if (cancelled) return;

        setTempEmail(account.data.username);
        mailjs.on("arrive", async (event: MailEvent) => {
          try {
            const full = await mailjs.getMessage(event.id);
            if (!full.status || cancelled) return;
            const message = full.data as unknown as TempMailMessage;
            setMessages((prev) =>
              prev.some((m) => m.id === message.id) ? prev : [message, ...prev]
            );
            setToastMessage(message);
          } catch (e) {
            console.error("获取新邮件失败:", e);
          }
        });
      } catch (e) {
        console.error("初始化临时邮箱失败:", e);
        if (!cancelled) {
          setEmailError(e instanceof Error ? e.message : "临时邮箱不可用");
        }
      } finally {
        if (!cancelled) setEmailLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
      mailjs.off();
    };
  }, []);

  return {
    tempEmail,
    emailLoading,
    emailError,
    messages,
    selectedMessage,
    setSelectedMessage,
    toastMessage,
    setToastMessage,
  };
}
