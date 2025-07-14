from fastapi import APIRouter

from controllers.genvid_controller import genvid_router
from controllers.auth_controller import auth_router

app_router = APIRouter()

app_router.include_router(genvid_router, tags=["GenVid"])
app_router.include_router(auth_router, tags=["Auth"])
