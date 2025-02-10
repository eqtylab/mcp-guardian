use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use anyhow::{bail, Result};
use serde_json::Value;

pub struct RequestCache {
    cache: Arc<Mutex<HashMap<Value, Value>>>,
}

impl RequestCache {
    pub fn new() -> Self {
        Self {
            cache: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn store_request(&self, request: Value) -> Result<()> {
        let Some(id) = request.get("id").cloned() else {
            bail!("Request does not have an id.");
        };

        self.cache
            .lock()
            .expect("Error unlocking mutex")
            .insert(id, request);

        Ok(())
    }

    pub fn pop_request(&self, id: &Value) -> Result<Option<Value>> {
        let request = self.cache.lock().expect("Error unlocking mutex").remove(id);

        Ok(request)
    }
}

impl Default for RequestCache {
    fn default() -> Self {
        Self::new()
    }
}
