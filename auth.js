// js/auth.js
class AuthManager {
  // دخول ولي الأمر
  async signInParent(playerName, accessCode) {
    console.log('محاولة تسجيل دخول ولي الأمر:', { playerName, accessCode });
    
    try {
      // التحقق من وجود كائن supabase
      if (!supabase) {
        console.error('كائن supabase غير موجود!');
        return { success: false, error: 'خطأ في الاتصال بقاعدة البيانات' };
      }
      
      console.log('جاري الاستعلام عن بيانات ولي الأمر...');
      const { data, error } = await supabase
        .from('parents')
        .select(`
          *,
          players(*)
        `)
        .eq('player_name', playerName)
        .eq('access_code', accessCode)
        .single();
      
      if (error) {
        console.error('خطأ في استعلام ولي الأمر:', error);
        return { success: false, error: error.message };
      }
      
      console.log('نتيجة استعلام ولي الأمر:', data);
      
      if (data) {
        localStorage.setItem('currentUser', JSON.stringify({
          type: 'parent',
          data: data
        }));
        console.log('تم تسجيل دخول ولي الأمر بنجاح');
        return { success: true, user: data };
      }
      
      console.log('بيانات ولي الأمر غير صحيحة');
      return { success: false, error: 'بيانات غير صحيحة' };
    } catch (error) {
      console.error('استثناء في تسجيل دخول ولي الأمر:', error);
      return { success: false, error: error.message };
    }
  }

  // دخول المدرب
  async signInCoach(email, password) {
    console.log('محاولة تسجيل دخول المدرب:', { email });
    
    try {
      // التحقق من وجود كائن supabase
      if (!supabase) {
        console.error('كائن supabase غير موجود!');
        return { success: false, error: 'خطأ في الاتصال بقاعدة البيانات' };
      }
      
      console.log('جاري الاستعلام عن بيانات المدرب...');
      const { data, error } = await supabase
        .from('coaches')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) {
        console.error('خطأ في استعلام المدرب:', error);
        return { success: false, error: error.message };
      }
      
      console.log('نتيجة استعلام المدرب:', data);
      
      if (data && data.password_hash === btoa(password)) { // تشفير بسيط
        localStorage.setItem('currentUser', JSON.stringify({
          type: 'coach',
          data: data
        }));
        console.log('تم تسجيل دخول المدرب بنجاح');
        return { success: true, user: data };
      }
      
      console.log('بيانات المدرب غير صحيحة');
      return { success: false, error: 'بيانات غير صحيحة' };
    } catch (error) {
      console.error('استثناء في تسجيل دخول المدرب:', error);
      return { success: false, error: error.message };
    }
  }

  // دخول الإدارة
  async signInAdmin(email, password) {
    console.log('محاولة تسجيل دخول الإدارة:', { email });
    
    try {
      // التحقق من وجود كائن supabase
      if (!supabase) {
        console.error('كائن supabase غير موجود!');
        return { success: false, error: 'خطأ في الاتصال بقاعدة البيانات' };
      }
      
      console.log('جاري تسجيل دخول الإدارة...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (error) {
        console.error('خطأ في تسجيل دخول الإدارة:', error);
        return { success: false, error: error.message };
      }
      
      console.log('نتيجة تسجيل دخول الإدارة:', data);
      
      if (data.user) {
        localStorage.setItem('currentUser', JSON.stringify({
          type: 'admin',
          data: data.user
        }));
        console.log('تم تسجيل دخول الإدارة بنجاح');
        return { success: true, user: data.user };
      }
      
      console.log('بيانات الإدارة غير صحيحة');
      return { success: false, error: 'بيانات غير صحيحة' };
    } catch (error) {
      console.error('استثناء في تسجيل دخول الإدارة:', error);
      return { success: false, error: error.message };
    }
  }

  // تسجيل الخروج
  logout() {
    localStorage.removeItem('currentUser')
    location.reload()
  }

  // التحقق من المستخدم الحالي
  getCurrentUser() {
    const user = localStorage.getItem('currentUser')
    return user ? JSON.parse(user) : null
  }
}

// إنشاء مثيل عام
window.authManager = new AuthManager()
