
// script to assign all players to coaches automatically
// Run this in the browser console after logging in as admin

async function assignAllPlayersToCoaches() {
    try {
        // استخدام دالة showLoader من النظام
        if (typeof window.showLoader === 'function') {
            window.showLoader();
        } else {
            console.log('بدء عملية تعيين اللاعبين...');
        }

        // جلب جميع اللاعبين
        const { data: players, error: playersError } = await supabase
            .from('players')
            .select('*');

        if (playersError) {
            console.error('خطأ في جلب اللاعبين:', playersError);
            showToast('خطأ في جلب اللاعبين: ' + playersError.message, 'error');
            hideLoader();
            return;
        }

        console.log('تم جلب', players.length, 'لاعب');

        // جلب جميع المدربين
        const { data: coaches, error: coachesError } = await supabase
            .from('coaches')
            .select('id, name')
            .order('name', { ascending: true });

        if (coachesError) {
            console.error('خطأ في جلب المدربين:', coachesError);
            showToast('خطأ في جلب المدربين: ' + coachesError.message, 'error');
            hideLoader();
            return;
        }

        console.log('تم جلب', coaches.length, 'مدرب');

        if (coaches.length === 0) {
            showToast('لا يوجد مدربين في النظام', 'error');
            hideLoader();
            return;
        }

        // إنشاء خريطة لربط كل لاعب بمدرب
        const assignments = {};
        let playerIndex = 0;

        // توزيع اللاعبين بالتساوي على المدربين
        players.forEach(player => {
            if (!player.coach_id) { // فقط اللاعبين الذين ليس لهم مدرب
                const coach = coaches[playerIndex % coaches.length];
                assignments[player.id] = coach.id;
                playerIndex++;
            }
        });

        console.log('سيتم تعيين', Object.keys(assignments).length, 'لاعب لـ', coaches.length, 'مدرب');

        // تحديث كل لاعب بمدربه
        let updatedCount = 0;
        for (const [playerId, coachId] of Object.entries(assignments)) {
            const { error } = await supabase
                .from('players')
                .update({ coach_id: coachId })
                .eq('id', playerId);

            if (error) {
                console.error('خطأ في تعيين اللاعب', playerId, 'للمدرب', coachId, ':', error);
            } else {
                updatedCount++;
                console.log('تم تعيين اللاعب', playerId, 'للمدرب', coachId);
            }
        }

        showToast(`تم تعيين ${updatedCount} لاعب بنجاح إلى المدربين`, 'success');
        console.log('تم تعيين', updatedCount, 'لاعب إلى المدربين');

        // تحديث قائمة اللاعبين في الواجهة
        if (window.loadPlayersList) {
            await loadPlayersList();
        }

    } catch (error) {
        console.error('خطأ عام في عملية التعيين:', error);
        showToast('حدث خطأ أثناء عملية التعيين: ' + error.message, 'error');
    } finally {
        // استخدام دالة hideLoader من النظام
        if (typeof window.hideLoader === 'function') {
            window.hideLoader();
        } else {
            console.log('اكتملت عملية تعيين اللاعبين.');
        }
    }
}

// استدعاء الدالة
assignAllPlayersToCoaches();
