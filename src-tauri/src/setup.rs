use tauri::{App, Manager};
use window_vibrancy::{self, NSVisualEffectMaterial, NSVisualEffectState};

/// tauri setup
pub fn init(app: &mut App) -> std::result::Result<(), Box<dyn std::error::Error>> {
    let win = app.get_window("main").unwrap();

    // 仅在 macOS 下执行
    #[cfg(target_os = "macos")]
    window_vibrancy::apply_vibrancy(&win, NSVisualEffectMaterial::FullScreenUI, Some(NSVisualEffectState::Active), None)
        .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

    Ok(())
}
