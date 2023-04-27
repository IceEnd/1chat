// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod setup;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::system::read_config,
            commands::system::write_config,
            commands::session::read_state,
            commands::session::write_state,
            commands::session::read_session,
            commands::session::write_session,
            commands::session::delete_session,
        ])
        .setup(setup::init)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
