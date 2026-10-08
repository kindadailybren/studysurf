from fastapi import APIRouter

from controllers.genvid_controller import genvid_router
from controllers.auth_controller import auth_router
from controllers.db_controller import db_router
from controllers.job_controller import job_router

app_router = APIRouter()

app_router.include_router(job_router, tags=["Jobs"])
app_router.include_router(genvid_router, tags=["GenVid"])
app_router.include_router(auth_router, tags=["Auth"])
app_router.include_router(db_router, tags=["Database"])
