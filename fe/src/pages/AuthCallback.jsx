import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/supabaseClient";
import { getUserProfile, upsertUserProfile } from "../api/user";
import CompleteProfileModal from "../components/CompleteProfileModal";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [needsProfile, setNeedsProfile] = useState(false);
  const [current, setCurrent] = useState({
    userId: null,
    email: "",
    fullName: "",
  });

  useEffect(() => {
    async function handle() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      // Check profile exists and has role/phone/address at minimum
      const profile = await getUserProfile(user.id);
      const hasRequired =
        profile && profile.role && profile.phone && profile.address;
      if (!profile || !hasRequired) {
        setCurrent({
          userId: user.id,
          email: user.email || "",
          fullName:
            user.user_metadata?.fullName || user.user_metadata?.name || "",
        });
        setNeedsProfile(true);
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
    handle();
  }, [navigate]);

  const handleComplete = async (values) => {
    await upsertUserProfile({
      id: current.userId,
      fullName: current.fullName,
      email: current.email,
      role: values.role,
      phone: values.phone,
      address: values.address,
      facebook_profile_url: values.facebook_profile_url,
      kyc_image_url: values.kyc_image_url,
    });
    navigate("/dashboard", { replace: true });
  };

  return (
    <CompleteProfileModal
      open={needsProfile}
      onClose={() => navigate("/dashboard", { replace: true })}
      onSubmit={handleComplete}
      defaultValues={{ role: "Consumer" }}
    />
  );
}
