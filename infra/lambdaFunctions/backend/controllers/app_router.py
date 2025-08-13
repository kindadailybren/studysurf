from fastapi import APIRouter

from controllers.genvid_controller import genvid_router
from controllers.auth_controller import auth_router
from controllers.db_controller import db_router

app_router = APIRouter()

app_router.include_router(genvid_router, tags=["GenVid"])
app_router.include_router(auth_router, tags=["Auth"])
app_router.include_router(db_router, tags=["Database"])
