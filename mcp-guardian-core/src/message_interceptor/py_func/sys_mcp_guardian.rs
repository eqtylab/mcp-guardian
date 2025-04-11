use anyhow::{anyhow, Result};
use rustpython_vm::{builtins::PyStr, PyObjectRef, PyPayload, PyResult, VirtualMachine};

pub fn add_to_vm(vm: &VirtualMachine) -> Result<()> {
    let mcp_guardian = vm.new_module("mcp_guardian", vm.ctx.new_dict(), None);

    mcp_guardian
        .set_attr("send", vm.new_function("send", send), vm)
        .map_err(|_| anyhow!("Failed to set 'send' in mcp_guardian module."))?;

    mcp_guardian
        .set_attr("drop", vm.new_function("drop", drop), vm)
        .map_err(|_| anyhow!("Failed to set 'drop' in mcp_guardian module."))?;

    mcp_guardian
        .set_attr("return", vm.new_function("return", return_), vm)
        .map_err(|_| anyhow!("Failed to set 'return' in mcp_guardian module."))?;

    Ok(())
}

fn send(_self: PyObjectRef, msg: PyObjectRef, vm: &VirtualMachine) -> PyResult<()> {
    vm.current_globals()
        .set_item("__action", PyStr::from("send").into_pyobject(vm), vm)?;
    vm.current_globals().set_item("__msg", msg, vm)?;

    Ok(())
}

fn drop(_self: PyObjectRef, vm: &VirtualMachine) -> PyResult<()> {
    vm.current_globals()
        .set_item("__action", PyStr::from("drop").into_pyobject(vm), vm)?;

    Ok(())
}

fn return_(_self: PyObjectRef, msg: PyObjectRef, vm: &VirtualMachine) -> PyResult<()> {
    vm.current_globals()
        .set_item("__action", PyStr::from("return").into_pyobject(vm), vm)?;
    vm.current_globals().set_item("__msg", msg, vm)?;

    Ok(())
}
